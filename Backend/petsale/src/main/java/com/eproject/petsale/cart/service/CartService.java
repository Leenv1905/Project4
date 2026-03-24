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
}
