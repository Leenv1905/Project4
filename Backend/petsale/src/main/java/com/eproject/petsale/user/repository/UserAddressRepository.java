package com.eproject.petsale.user.repository;

import com.eproject.petsale.user.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findByUserId(Long userId);

    @Query("SELECT a FROM UserAddress a WHERE a.user.email = :email")
    List<UserAddress> findByUserEmail(@Param("email") String email);
}