package com.eproject.petsale.personalization.service;

import com.eproject.petsale.common.mapper.BuyerProfileMapper;
import com.eproject.petsale.personalization.dto.BuyerProfileRequest;
import com.eproject.petsale.personalization.dto.BuyerProfileResponse;
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
    private final BuyerProfileMapper buyerProfileMapper;

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

    public BuyerProfileResponse getMyProfile() {
        // 1. Lấy email từ Security Context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Tìm User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // 3. Tìm Profile và map sang Response
        return buyerProfileRepository.findById(user.getId())
                .map(buyerProfileMapper::toResponse) // Gọi MapStruct để chuyển đổi
                .orElse(null);
    }
}
