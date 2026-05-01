package com.eproject.petsale.user.repository;

import com.eproject.petsale.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByRefreshToken(String refreshToken);

    List<User> findByRoles_Name(String roleName);
}

