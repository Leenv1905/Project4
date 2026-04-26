package com.eproject.petsale.user.repository;


import com.eproject.petsale.user.entity.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    // JpaRepository đã hỗ trợ sẵn các hàm như save(), findById(), existsById()
    // Vì userId là ID của thực thể, ta dùng các hàm mặc định này là đủ.
}