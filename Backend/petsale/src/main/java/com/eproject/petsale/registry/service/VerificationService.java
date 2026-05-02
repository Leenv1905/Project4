package com.eproject.petsale.registry.service;

import com.eproject.petsale.common.service.R2StorageService;
import com.eproject.petsale.order.entity.Order;
import com.eproject.petsale.order.repository.OrderRepository;
import com.eproject.petsale.pet.entity.Pet;
import com.eproject.petsale.pet.repository.PetRepository;
import com.eproject.petsale.pet.service.RegistryClientService;
import com.eproject.petsale.registry.dto.OrderVerificationResponse;
import com.eproject.petsale.registry.dto.VerificationTaskResponse;
import com.eproject.petsale.registry.entity.VerificationTask;
import com.eproject.petsale.registry.repository.VerificationTaskRepository;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationTaskRepository taskRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final R2StorageService r2StorageService;
    private final OrderRepository orderRepository;
    private final RegistryClientService registryClientService;

    @Transactional
    public void assignTask(Long petId, Long operatorId) {
        // Kiểm tra xem thú cưng này đã có nhiệm vụ nào đang xử lý chưa
        if (taskRepository.existsByPetIdAndStatusIn(petId, List.of("PENDING", "SUBMITTED"))) {
            throw new RuntimeException("Thú cưng này đã được giao việc hoặc đang chờ duyệt, không thể giao thêm.");
        }

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        User operator = userRepository.findById(operatorId)
                .orElseThrow(() -> new RuntimeException("Operator not found"));

        VerificationTask task = new VerificationTask();
        task.setPet(pet);
        task.setOperator(operator);
        task.setStatus("PENDING");
        task.setAssignedAt(LocalDateTime.now());
        taskRepository.save(task);
    }

    public List<VerificationTaskResponse> getMyTasks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return taskRepository.findByOperatorEmail(email)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void autoAssignForPet(Pet pet) {
        if (taskRepository.existsByPetIdAndStatusIn(pet.getId(), List.of("PENDING", "SUBMITTED"))) {
            return;
        }

        List<User> operators = userRepository.findByRoles_Name("OPERATOR");
        if (operators.isEmpty()) return;

        // Phân công cho operator ít việc nhất (load balance)
        User assigned = operators.stream()
                .min(Comparator.comparingLong(op ->
                        taskRepository.countByOperatorIdAndStatusIn(op.getId(), List.of("PENDING", "SUBMITTED"))))
                .orElse(operators.get(0));

        VerificationTask task = new VerificationTask();
        task.setPet(pet);
        task.setOperator(assigned);
        task.setStatus("PENDING");
        task.setAssignedAt(LocalDateTime.now());
        taskRepository.save(task);
    }

    public String uploadChipImage(Long taskId, MultipartFile file) {
        taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        try {
            R2StorageService.PetImageUploadResult result =
                    r2StorageService.uploadToFolder(file, "chips/" + taskId);
            return result.imageUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload chip image", e);
        }
    }

    // Returns "APPROVED" or "REJECTED"
    @Transactional
    public String submitVerification(Long taskId, String chipCode, String chipUrl, String gps, String note) {
        VerificationTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setScannedChipCode(chipCode);
        task.setScannedChipImageUrl(chipUrl);
        task.setLocationGps(gps);
        task.setHealthNote(note);
        task.setCompletedAt(LocalDateTime.now());

        Pet pet = task.getPet();

        // Lấy token từ cookie access_token
        String token = null;
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            Cookie[] cookies = attrs.getRequest().getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("access_token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
        }

        // Chip phải khớp với mã đăng ký của thú cưng VÀ phải tồn tại trong registry service
        boolean chipMatchesPet = chipCode != null
                && chipCode.trim().equalsIgnoreCase(pet.getPetCode() != null ? pet.getPetCode().trim() : "");
        boolean inRegistry = chipMatchesPet && token != null
                && registryClientService.checkPetVerification(chipCode.trim(), token);
        boolean chipMatches = inRegistry;

        if (chipMatches) {
            task.setStatus("APPROVED");
            pet.setIsVerified(true);
            pet.setTrustScore(95);
            pet.setStatus("AVAILABLE");
            petRepository.save(pet);

            // Chỉ CONFIRMED khi TẤT CẢ pet trong đơn đã được xác minh
            List<Order> orders = orderRepository.findByOrderItems_Pet_Id(pet.getId());
            for (Order order : orders) {
                if ("CREATED".equals(order.getStatus())) {
                    boolean allVerified = order.getOrderItems().stream()
                            .filter(item -> item.getPet() != null)
                            .allMatch(item -> {
                                // Pet vừa verify (cùng id) → coi như đã verified dù JPA cache chưa flush
                                if (item.getPet().getId().equals(pet.getId())) return true;
                                return Boolean.TRUE.equals(item.getPet().getIsVerified());
                            });

                    if (allVerified) {
                        order.setStatus("CONFIRMED");
                        order.setFulfillmentStatus("VERIFIED");
                        order.setUpdatedAt(LocalDateTime.now());
                        orderRepository.save(order);
                    }
                    // Nếu còn pet khác chưa verify → order giữ nguyên CREATED, chờ xác minh tiếp
                }
            }
        } else {
            task.setStatus("REJECTED");
            // Bất kỳ pet nào bị từ chối → huỷ toàn bộ đơn ngay lập tức
            List<Order> orders = orderRepository.findByOrderItems_Pet_Id(pet.getId());
            for (Order order : orders) {
                if ("CREATED".equals(order.getStatus())) {
                    order.setStatus("CANCELLED");
                    order.setFulfillmentStatus("FAILED");
                    order.setUpdatedAt(LocalDateTime.now());
                    orderRepository.save(order);
                }
            }
        }

        taskRepository.save(task);
        return task.getStatus();
    }

    @Transactional
    public void cancelOrderByTask(Long taskId) {
        VerificationTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus("REJECTED");
        task.setCompletedAt(LocalDateTime.now());
        taskRepository.save(task);

        List<Order> orders = orderRepository.findByOrderItems_Pet_Id(task.getPet().getId());
        for (Order order : orders) {
            if ("CREATED".equals(order.getStatus())) {
                order.setStatus("CANCELLED");
                order.setFulfillmentStatus("FAILED");
                order.setUpdatedAt(LocalDateTime.now());
                orderRepository.save(order);
            }
        }
    }

    @Transactional
    public void approveVerification(Long taskId, String feedback) {
        VerificationTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setStatus("APPROVED");
        task.setAdminFeedback(feedback);
        taskRepository.save(task);

        Pet pet = task.getPet();
        pet.setIsVerified(true);
        pet.setTrustScore(95);
        pet.setStatus("AVAILABLE");
        petRepository.save(pet);

        // Kiểm tra nếu tất cả pet trong đơn đã xác minh → cập nhật order
        List<Order> orders = orderRepository.findByOrderItems_Pet_Id(pet.getId());
        for (Order order : orders) {
            if ("CREATED".equals(order.getStatus())) {
                boolean allVerified = order.getOrderItems().stream()
                        .filter(item -> item.getPet() != null)
                        .allMatch(item -> {
                            if (item.getPet().getId().equals(pet.getId())) return true;
                            return Boolean.TRUE.equals(item.getPet().getIsVerified());
                        });

                if (allVerified) {
                    order.setStatus("CONFIRMED");
                    order.setFulfillmentStatus("VERIFIED");
                    order.setUpdatedAt(LocalDateTime.now());
                    orderRepository.save(order);
                }
            }
        }
    }

    public List<VerificationTaskResponse> getAllSubmittedTasks() {
        return taskRepository.findByStatus("SUBMITTED")
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<VerificationTaskResponse> getAllPendingTasks() {
        return taskRepository.findByStatus("PENDING")
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<OrderVerificationResponse> getUnassignedPetsWithOrderContext() {
        List<Order> waitingOrders = orderRepository.findByStatusAndFulfillmentStatus("CREATED", "WAITING_VERIFY");

        return waitingOrders.stream()
                .map(order -> {
                    List<OrderVerificationResponse.PetToVerify> petsToVerify = order.getOrderItems().stream()
                            .filter(item -> item.getPet() != null)
                            .map(item -> {
                                Pet pet = item.getPet();
                                return OrderVerificationResponse.PetToVerify.builder()
                                        .petId(pet.getId())
                                        .petName(pet.getName())
                                        .breed(pet.getBreed())
                                        .petCode(pet.getPetCode())
                                        .shopName(pet.getUser() != null ? pet.getUser().getName() : "—")
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return OrderVerificationResponse.builder()
                            .orderId(order.getId())
                            .orderCode(order.getOrderCode())
                            .totalPetsInOrder(order.getOrderItems().size())
                            .petsToVerify(petsToVerify)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<VerificationTaskResponse> getTasksByStatus(String status) {
        return taskRepository.findByStatus(status.toUpperCase())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private VerificationTaskResponse mapToResponse(VerificationTask task) {
        return VerificationTaskResponse.builder()
                .id(task.getId())
                .status(task.getStatus())
                .assignedAt(task.getAssignedAt())
                .completedAt(task.getCompletedAt())
                .scannedChipCode(task.getScannedChipCode())
                .scannedChipImageUrl(task.getScannedChipImageUrl())
                .locationGps(task.getLocationGps())
                .healthNote(task.getHealthNote())
                .adminFeedback(task.getAdminFeedback())
                .pet(VerificationTaskResponse.PetInfo.builder()
                        .id(task.getPet().getId())
                        .name(task.getPet().getName())
                        .petCode(task.getPet().getPetCode())
                        .breed(task.getPet().getBreed())
                        .price(task.getPet().getPrice())
                        .ownerName(task.getPet().getUser().getName())
                        .build())
                .operator(VerificationTaskResponse.OperatorInfo.builder()
                        .id(task.getOperator().getId())
                        .name(task.getOperator().getName())
                        .email(task.getOperator().getEmail())
                        .build())
                .build();
    }
}
