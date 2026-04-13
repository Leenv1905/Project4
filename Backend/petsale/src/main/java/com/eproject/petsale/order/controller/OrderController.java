package com.eproject.petsale.order.controller;

import com.eproject.petsale.order.dto.CheckoutRequest;
import com.eproject.petsale.order.dto.OrderResponse;
import com.eproject.petsale.order.service.OrderService;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gupet/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping("/checkout")
    public ResponseEntity<List<OrderResponse>> checkout(@RequestBody CheckoutRequest request) {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(orderService.checkout(user.getId(), request));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(orderService.getMyOrders(user.getId()));
    }
}
