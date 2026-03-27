package com.eproject.petsale.cart.controller;

import com.eproject.petsale.cart.dto.AddToCartRequest;
import com.eproject.petsale.cart.service.CartService;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gupet/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody AddToCartRequest request
    ) {

        User user = userService.getCurrentUser(); // bạn đã có logic này

        cartService.addToCart(
                user.getId(),
                request.getPetId(),
                request.getQuantity()
        );

        return ResponseEntity.ok("Added to cart");
    }
}