package com.eproject.petsale.auth.repository;

import com.eproject.petsale.auth.entity.SsoAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SsoAccountRepository extends JpaRepository<SsoAccount, Long> {
    Optional<SsoAccount> findByProviderAndProviderUserId(String provider, String providerUserId);
}
