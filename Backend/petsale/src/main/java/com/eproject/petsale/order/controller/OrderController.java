package com.eproject.petsale.order.controller;

import com.eproject.petsale.order.dto.CheckoutRequest;
import com.eproject.petsale.order.dto.OrderResponse;
import com.eproject.petsale.order.service.OrderService;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.entity.UserAddress;
import com.eproject.petsale.user.repository.UserAddressRepository;
import com.eproject.petsale.user.repository.UserRepository;
import com.eproject.petsale.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gupet/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;

    @PostMapping("/checkout")
    public List<OrderResponse> checkout(@RequestBody CheckoutRequest request) {
        return orderService.checkout(request);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(orderService.getMyOrders(user.getId()));
    }
    @PutMapping("/addresses/{id}/default")
    public void setDefault(@PathVariable Long id, Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        List<UserAddress> list = userAddressRepository.findByUserId(user.getId());

        for (UserAddress a : list) {
            a.setIsDefault(a.getId().equals(id));
        }

        userAddressRepository.saveAll(list);
    }
    @PostMapping("/{orderId}/verify")
    public ResponseEntity<String> verifyOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.verifyOrder(orderId));
    }

}
