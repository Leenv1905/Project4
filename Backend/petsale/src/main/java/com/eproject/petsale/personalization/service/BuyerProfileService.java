package com.eproject.petsale.personalization.service;

import com.eproject.petsale.personalization.dto.BuyerProfileRequest;
import com.eproject.petsale.personalization.entity.BuyerProfile;
import com.eproject.petsale.personalization.repository.BuyerProfileRepository;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BuyerProfileService {

    private final BuyerProfileRepository buyerProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public void saveProfile(BuyerProfileRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BuyerProfile profile = buyerProfileRepository.findById(user.getId())
                .orElse(new BuyerProfile());

        profile.setUser(user);
        profile.setDailyTime(request.getDailyTime());
        profile.setLivingSpace(request.getLivingSpace());
        profile.setActivityTime(request.getActivityTime());
        profile.setMonthlyBudget(request.getMonthlyBudget());
        profile.setExperienceLevel(request.getExperienceLevel());
        profile.setCreatedAt(LocalDateTime.now());

        buyerProfileRepository.save(profile);
    }

    public BuyerProfile getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buyerProfileRepository.findById(user.getId()).orElse(null);
    }
}
