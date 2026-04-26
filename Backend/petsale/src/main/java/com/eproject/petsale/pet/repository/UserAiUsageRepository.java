package com.eproject.petsale.pet.repository;


import com.eproject.petsale.pet.entity.UserAiUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface UserAiUsageRepository extends JpaRepository<UserAiUsage, Long> {
    Optional<UserAiUsage> findByUserIdAndUsageDate(Long userId, LocalDate date);
}