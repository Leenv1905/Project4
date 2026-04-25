package com.eproject.petsale.registry.service;

import com.eproject.petsale.pet.entity.Pet;
import com.eproject.petsale.pet.repository.PetRepository;
import com.eproject.petsale.registry.entity.VerificationTask;
import com.eproject.petsale.registry.repository.VerificationTaskRepository;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.eproject.petsale.registry.dto.VerificationTaskResponse;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationTaskRepository taskRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

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
        return taskRepository.findByOperatorEmailAndStatus(email, "PENDING")
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void submitVerification(Long taskId, String chipUrl, String gps, String note) {
        VerificationTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setScannedChipImageUrl(chipUrl);
        task.setLocationGps(gps);
        task.setHealthNote(note);
        task.setStatus("SUBMITTED");
        task.setCompletedAt(LocalDateTime.now());
        taskRepository.save(task);
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
        pet.setTrustScore(95); // Example score boost
        pet.setStatus("AVAILABLE"); // Cập nhật trạng thái để có thể mua
        petRepository.save(pet);

    }

    public List<VerificationTaskResponse> getAllSubmittedTasks() {
        return taskRepository.findByStatus("SUBMITTED")
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<VerificationTaskResponse> getAllPendingTasks() {
        return taskRepository.findByStatus("PENDING")
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private VerificationTaskResponse mapToResponse(VerificationTask task) {
        return VerificationTaskResponse.builder()
                .id(task.getId())
                .status(task.getStatus())
                .assignedAt(task.getAssignedAt())
                .completedAt(task.getCompletedAt())
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
