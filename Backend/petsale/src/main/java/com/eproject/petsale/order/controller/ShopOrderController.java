package com.eproject.petsale.order.controller;

import com.eproject.petsale.order.dto.OrderResponse;
import com.eproject.petsale.order.dto.ShopReconciliationDTO;
import com.eproject.petsale.order.service.OrderService;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/gupet/api/v1/shop/orders")
@RequiredArgsConstructor
public class ShopOrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getShopOrders(Authentication authentication) {
        String email = authentication.getName();
        User shop = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        return ResponseEntity.ok(orderService.getShopOrders(shop.getId()));
    }

    @GetMapping("/reconciliation")
    public ResponseEntity<ShopReconciliationDTO> getReconciliation(Authentication authentication) {
        String email = authentication.getName();
        User shop = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        return ResponseEntity.ok(orderService.getShopReconciliation(shop.getId()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateShopOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String email = authentication.getName();
        User shop = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        
        String status = payload.getOrDefault("status", "SHIPPING");
        return ResponseEntity.ok(orderService.updateShopOrderStatus(shop.getId(), id, status));
    }
}
