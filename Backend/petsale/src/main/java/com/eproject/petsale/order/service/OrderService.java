package com.eproject.petsale.order.service;

import com.eproject.petsale.common.util.SecurityUtils;
import com.eproject.petsale.cart.entity.Cart;
import com.eproject.petsale.cart.entity.CartItem;
import com.eproject.petsale.cart.repository.CartItemRepository;
import com.eproject.petsale.cart.repository.CartRepository;
import com.eproject.petsale.common.mapper.OrderEventMapper;
import com.eproject.petsale.order.dto.CheckoutRequest;
import com.eproject.petsale.order.dto.OrderItemResponse;
import com.eproject.petsale.order.dto.OrderResponse;
import com.eproject.petsale.order.entity.Order;
import com.eproject.petsale.order.entity.OrderEvent;
import com.eproject.petsale.order.entity.OrderEventRepository;
import com.eproject.petsale.order.entity.OrderItem;
import com.eproject.petsale.order.repository.OrderItemRepository;
import com.eproject.petsale.order.repository.OrderRepository;
import com.eproject.petsale.pet.service.RegistryClientService;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.entity.UserAddress;
import com.eproject.petsale.user.repository.UserAddressRepository;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final OrderEventMapper orderEventMapper;
    private final OrderEventRepository orderEventRepository;
    private final UserAddressRepository userAddressRepository;
    private final RegistryClientService registryClientService;

    @Transactional
    public List<OrderResponse> checkout(CheckoutRequest request){        // 1. Get buyer and their cart
        Long buyerId = getCurrentUserId();

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        Cart cart = cartRepository.findByUserId(buyerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        UserAddress address;

        if (request.getAddressId() != null) {
            address = userAddressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));
        } else {
            address = userAddressRepository.findByUserId(buyerId).stream()
                    .filter(UserAddress::getIsDefault)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No default address"));
        }
        if (!address.getUser().getId().equals(buyer.getId())) {
            throw new RuntimeException("Invalid address");
        }
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 2. Group CartItems by Seller (Shop)
        Map<User, List<CartItem>> itemsByShop = cart.getItems().stream()
                .collect(Collectors.groupingBy(item -> item.getPet().getUser()));

        List<Order> newOrders = new ArrayList<>();

        // 3. Create independent order for each shop
        for (Map.Entry<User, List<CartItem>> entry : itemsByShop.entrySet()) {
            User shop = entry.getKey();
            List<CartItem> shopItems = entry.getValue();

            Order order = new Order();
            order.setBuyer(buyer);
            order.setShop(shop);
            order.setAddress(address.getAddress());
            order.setPhone(address.getPhone());
            order.setCustomerName(address.getReceiverName());
            order.setNote(request.getNote());
            order.setPaymentStatus("PENDING");
            order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");
            order.setFulfillmentStatus("PROCESSING");
            order.setFulfillmentStatus("WAITING_VERIFY");
            order.setStatus("CREATED");
            order.setCreatedAt(LocalDateTime.now());
            order.setUpdatedAt(LocalDateTime.now());

            BigDecimal totalAmount = BigDecimal.ZERO;
            List<OrderItem> orderItems = new ArrayList<>();

            for (CartItem cartItem : shopItems) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setPet(cartItem.getPet());
                orderItem.setQuantity(cartItem.getQuantity());

                BigDecimal price = cartItem.getPet().getPrice() != null ? cartItem.getPet().getPrice() : BigDecimal.ZERO;
                orderItem.setPrice(price);

                totalAmount = totalAmount.add(price.multiply(BigDecimal.valueOf(cartItem.getQuantity())));
                orderItems.add(orderItem);
            }

            order.setTotalAmount(totalAmount);
            order.setOrderItems(orderItems);
            Order savedOrder = orderRepository.save(order);

            // thêm log
            OrderEvent event = orderEventMapper.toEvent(
                    savedOrder.getId(),
                    null,
                    "CREATED",
                    buyer.getId(),
                    "BUYER",
                    null
            );

            orderEventRepository.save(event);

            newOrders.add(savedOrder);
        }

        // 4. Clear the cart securely
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();

        // 5. Convert to DTO
        return newOrders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Long buyerId) {
        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrdersForAdmin() {
        return orderRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getShopOrders(Long shopId) {
        return orderRepository.findByShopIdOrderByCreatedAtDesc(shopId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateShopOrderStatus(Long shopId, Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getShop().getId().equals(shopId)) {
            throw new RuntimeException("You do not have permission to update this order");
        }

        // Shop can only change fulfillment status, e.g. from PROCESSING to SHIPPING or DELIVERED
        order.setFulfillmentStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(orderRepository.save(order));
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setAddress(order.getAddress());
        dto.setCustomerName(order.getCustomerName());
        dto.setPhone(order.getPhone());
        dto.setNote(order.getNote());
        dto.setStatus(order.getStatus());
        dto.setFulfillmentStatus(order.getFulfillmentStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setBuyerId(order.getBuyer().getId());
        dto.setShopId(order.getShop().getId());
        dto.setShopName(order.getShop().getName());

        List<OrderItemResponse> itemResponses = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem oi : order.getOrderItems()) {
                OrderItemResponse itemResp = new OrderItemResponse();
                itemResp.setId(oi.getId());
                itemResp.setPetId(oi.getPet().getId());
                itemResp.setPetName(oi.getPet().getName());
                itemResp.setPrice(oi.getPrice());
                itemResp.setQuantity(oi.getQuantity());

                if (oi.getPet().getImages() != null && !oi.getPet().getImages().isEmpty()) {
                    itemResp.setPetImage(oi.getPet().getImages().get(0).getImageUrl());
                }
                itemResponses.add(itemResp);
            }
        }
        dto.setItems(itemResponses);
        return dto;
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus, Long actorId, String actorRole) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String oldStatus = order.getStatus();

        validateTransition(oldStatus, newStatus);

        // ✅ sửa đúng field
        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        Order saved = orderRepository.save(order);

        // ✅ dùng mapper
        OrderEvent event = orderEventMapper.toEvent(
                orderId,
                oldStatus,
                newStatus,
                actorId,
                actorRole,
                null
        );

        orderEventRepository.save(event);

        return mapToResponse(saved);
    }

    private void validateTransition(String from, String to) {
        Map<String, List<String>> flow = Map.of(
                "CREATED", List.of("SHOP_CONFIRMED"),
                "SHOP_CONFIRMED", List.of("WAREHOUSE_RECEIVED"),
                "WAREHOUSE_RECEIVED", List.of("INSPECTION_PASSED", "INSPECTION_FAILED"),
                "INSPECTION_PASSED", List.of("DELIVERY_STARTED"),
                "DELIVERY_STARTED", List.of("DELIVERY_COMPLETED", "DELIVERY_FAILED"),
                "DELIVERY_COMPLETED", List.of("CUSTOMER_CONFIRMED")
        );

        if (!flow.containsKey(from) || !flow.get(from).contains(to)) {
            throw new RuntimeException("Invalid status transition");
        }
    }
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();
        // principal: user đang đăng nhập

        return user.getId();
    }

    @Transactional
    public String verifyOrder(Long orderId) {

        if (!SecurityUtils.isOperator()) {
            throw new RuntimeException("Access denied");
        }

        String token = SecurityUtils.getCurrentToken();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"WAITING_VERIFY".equals(order.getFulfillmentStatus())) {
            throw new RuntimeException("Order not in verify state");
        }

        boolean allValid = true;

        for (OrderItem item : order.getOrderItems()) {
            String petCode = item.getPet().getPetCode();

            boolean isVerified =
                    registryClientService.checkPetVerification(petCode, token);

            if (!isVerified) {
                allValid = false;
                break;
            }
        }

        if (!allValid) {
            order.setStatus("CANCELLED");
            order.setFulfillmentStatus("FAILED");
            order.setUpdatedAt(LocalDateTime.now());

            orderRepository.save(order);
            return order.getStatus();
        }

        order.setFulfillmentStatus("SHIPPING");
        order.setStatus("CONFIRMED");
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);

        return order.getStatus();
    }
}
