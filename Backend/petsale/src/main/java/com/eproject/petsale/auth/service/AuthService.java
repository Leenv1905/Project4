package com.eproject.petsale.auth.service;

import com.eproject.petsale.auth.dto.AuthResponse;
import com.eproject.petsale.auth.dto.LoginRequest;
import com.eproject.petsale.auth.dto.RegisterRequest;
import com.eproject.petsale.auth.security.JwtUtil;
import com.eproject.petsale.common.exception.AuthException;
import com.eproject.petsale.personalization.entity.BuyerProfile;
import com.eproject.petsale.personalization.repository.BuyerProfileRepository;
import com.eproject.petsale.user.entity.Role;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.RoleRepository;
import com.eproject.petsale.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BuyerProfileRepository buyerProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();

        user.setEmail(request.getEmail());

        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        // lấy role USER để set role cho user
        Role role = roleRepository.findByName("USER");

        user.setRole(role);

        userRepository.save(user);

        BuyerProfile profile = new BuyerProfile();

        profile.setDailyTime(request.getPersonalization().getDailyTime());
        profile.setLivingSpace(request.getPersonalization().getLivingSpace());
        profile.setActivityTime(request.getPersonalization().getActivityTime());
        profile.setMonthlyBudget(request.getPersonalization().getMonthlyBudget());
        profile.setExperienceLevel(request.getPersonalization().getExperienceLevel());

        profile.setUser(user);

        buyerProfileRepository.save(profile);

        String accessToken = jwtUtil.generateToken(user.getEmail());

        String refreshToken = UUID.randomUUID().toString();

        user.setRefreshToken(refreshToken);

        userRepository.save(user);

        AuthResponse res = new AuthResponse();

        res.setAccessToken(accessToken);
        res.setRefreshToken(refreshToken);

        res.setUserId(user.getId());
        res.setName(user.getName());
        res.setRole(user.getRole().getName());

        return res;
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("User not found"));

        boolean checkPassword = passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash());

        if (!checkPassword) {
            throw new AuthException("Password incorrect");
        }

        String accessToken = jwtUtil.generateToken(user.getEmail());

        String refreshToken = UUID.randomUUID().toString();

        user.setRefreshToken(refreshToken);

        userRepository.save(user);

        AuthResponse response = new AuthResponse();

        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setRole(user.getRole().getName());

        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);

        return response;
    }
}