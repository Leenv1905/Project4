package com.eproject.petsale.user.repository;

import com.eproject.petsale.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Chỉ giữ lại bản Optional để handle null-safe tốt hơn
    Optional<Role> findByName(String name);
}