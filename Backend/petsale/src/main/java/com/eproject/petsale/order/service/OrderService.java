package com.eproject.petsale.order.service;

import com.eproject.petsale.cart.entity.Cart;
import com.eproject.petsale.cart.entity.CartItem;
import com.eproject.petsale.cart.repository.CartItemRepository;
import com.eproject.petsale.cart.repository.CartRepository;
import com.eproject.petsale.order.dto.CheckoutRequest;
import com.eproject.petsale.order.dto.OrderItemResponse;
import com.eproject.petsale.order.dto.OrderResponse;
import com.eproject.petsale.order.entity.Order;
import com.eproject.petsale.order.entity.OrderItem;
import com.eproject.petsale.order.repository.OrderItemRepository;
import com.eproject.petsale.order.repository.OrderRepository;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @Transactional
    public List<OrderResponse> checkout(Long buyerId, CheckoutRequest request) {
        // 1. Get buyer and their cart
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        Cart cart = cartRepository.findByUserId(buyerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

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
            order.setAddress(request.getAddress());
            order.setPhone(request.getPhone());
            order.setCustomerName(request.getCustomerName());
            order.setNote(request.getNote());
            order.setPaymentStatus("PENDING");
            order.setFulfillmentStatus("PROCESSING");
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
            newOrders.add(orderRepository.save(order));
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

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setFulfillmentStatus(status);
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
}
