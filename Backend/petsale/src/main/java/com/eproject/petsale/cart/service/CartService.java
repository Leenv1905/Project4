package com.eproject.petsale.cart.service;

import com.eproject.petsale.cart.entity.Cart;
import com.eproject.petsale.cart.entity.CartItem;
import com.eproject.petsale.cart.repository.CartItemRepository;
import com.eproject.petsale.cart.repository.CartRepository;
import com.eproject.petsale.pet.entity.Pet;
import com.eproject.petsale.pet.repository.PetRepository;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addToCart(Long userId, Long petId, int quantity) {

        // 1. lấy hoặc tạo cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();

                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    newCart.setUser(user);

                    return cartRepository.save(newCart);
                });

        // 2. check pet tồn tại
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        // 3. check item đã tồn tại chưa
        Optional<CartItem> optionalItem =
                cartItemRepository.findByCartIdAndPetId(cart.getId(), petId);

        if (optionalItem.isPresent()) {
            // tăng số lượng
            CartItem item = optionalItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            // tạo mới
            CartItem item = new CartItem();

            item.setCart(cart);   // ✔ đúng
            item.setPet(pet);     // ✔ đúng

            item.setQuantity(quantity);
            item.setStatus("PENDING");

            cartItemRepository.save(item);
        }
    }

    @Transactional(readOnly = true)
    public com.eproject.petsale.cart.dto.CartResponse getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return new com.eproject.petsale.cart.dto.CartResponse();
        }

        com.eproject.petsale.cart.dto.CartResponse response = new com.eproject.petsale.cart.dto.CartResponse();
        response.setId(cart.getId());
        response.setUserId(userId);

        java.math.BigDecimal totalAmount = java.math.BigDecimal.ZERO;
        java.util.List<com.eproject.petsale.cart.dto.CartItemResponse> itemResponses = new java.util.ArrayList<>();

        for (CartItem item : cart.getItems()) {
            com.eproject.petsale.cart.dto.CartItemResponse itemResponse = new com.eproject.petsale.cart.dto.CartItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setPetId(item.getPet().getId());
            itemResponse.setPetName(item.getPet().getName());
            itemResponse.setPrice(item.getPet().getPrice());
            itemResponse.setQuantity(item.getQuantity());

            if (item.getPet().getImages() != null && !item.getPet().getImages().isEmpty()) {
                itemResponse.setPetImage(item.getPet().getImages().get(0).getImageUrl());
            }

            itemResponses.add(itemResponse);

            if (item.getPet().getPrice() != null) {
                totalAmount = totalAmount.add(item.getPet().getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())));
            }
        }

        response.setItems(itemResponses);
        response.setTotalAmount(totalAmount);
        return response;
    }

    @Transactional
    public void removeCartItem(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Item does not belong to user's cart");
        }

        cartItemRepository.delete(item);
    }
}
