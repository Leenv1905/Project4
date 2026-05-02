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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

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

        User user = userService.getCurrentUser();

        cartService.addToCart(
                user.getId(),
                request.getPetId(),
                request.getQuantity()
        );

        return ResponseEntity.ok("Added to cart");
    }

    @GetMapping
    public ResponseEntity<com.eproject.petsale.cart.dto.CartResponse> getCart() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(cartService.getCart(user.getId()));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long cartItemId) {
        User user = userService.getCurrentUser();
        cartService.removeCartItem(user.getId(), cartItemId);
        return ResponseEntity.ok("Removed item from cart");
    }
}