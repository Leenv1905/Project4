package com.eproject.petsale.cart.repository;

import com.eproject.petsale.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndPetId(Long cartId, Long petId);
}