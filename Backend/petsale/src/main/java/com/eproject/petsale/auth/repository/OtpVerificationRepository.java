package com.eproject.petsale.auth.repository;

import com.eproject.petsale.auth.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByOtpCodeAndOtpType(String otpCode, String otpType);
    Optional<OtpVerification> findByUserIdAndOtpType(Long userId, String otpType);
}
