package com.eproject.petsale.auth.service;

import com.eproject.petsale.auth.dto.AuthResponse;
import com.eproject.petsale.auth.dto.LoginRequest;
import com.eproject.petsale.auth.dto.RegisterRequest;
import com.eproject.petsale.auth.security.JwtUtil;
import com.eproject.petsale.common.exception.AuthException;
import com.eproject.petsale.common.mapper.UserMapperImpl;
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

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
    @Autowired
    private UserMapperImpl userMapperImpl;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        // Cập nhật Role cho ManyToMany
        Role role = roleRepository.findByName("USER");
        if (role == null) {
            // Tạo role mặc định nếu chưa có trong DB để tránh lỗi Null
            role = new Role();
            role.setName("USER");
            roleRepository.save(role);
        }
        // Thêm role vào Set thay vì set đơn lẻ
        user.getRoles().add(role);

        userRepository.save(user);
        String currentRoles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));

        // Personalization
        if (request.getPersonalization() != null) {
            BuyerProfile profile = new BuyerProfile();
            profile.setDailyTime(request.getPersonalization().getDailyTime());
            profile.setLivingSpace(request.getPersonalization().getLivingSpace());
            profile.setActivityTime(request.getPersonalization().getActivityTime());
            profile.setMonthlyBudget(request.getPersonalization().getMonthlyBudget());
            profile.setExperienceLevel(request.getPersonalization().getExperienceLevel());
            profile.setUser(user);
            buyerProfileRepository.save(profile);
        }



        String accessToken = jwtUtil.generateToken(user.getEmail(), currentRoles);
        String refreshToken = UUID.randomUUID().toString();
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        AuthResponse res = new AuthResponse();
        res.setAccessToken(accessToken);
        res.setRefreshToken(refreshToken);
        res.setUserId(user.getId());
        res.setName(user.getName());

        // Lấy tên role đầu tiên để trả về DTO (hoặc nối chuỗi các role)
        String roleName = user.getRoles().stream()
                .map(Role::getName)
                .findFirst()
                .orElse("USER");
        res.setRole(roleName);

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

        // KIỂM TRA AN TOÀN: Tránh lỗi NullPointerException nếu user không có role
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            throw new AuthException("User has no roles assigned");
        }

        String roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));

        // Truyền roleNames vừa lấy được từ DB vào Token
        String accessToken = jwtUtil.generateToken(user.getEmail(), roleNames);
        String refreshToken = UUID.randomUUID().toString();
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setRole(roleNames);
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);

        return response;
    }

    public String refreshAccessToken(String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthException("Refresh token missing");
        }

        User user = userRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new AuthException("Invalid refresh token"));

        String roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));

        return jwtUtil.generateToken(user.getEmail(), roleNames);
    }

    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }

        userRepository.findByRefreshToken(refreshToken).ifPresent(user -> {
            user.setRefreshToken(null);
            userRepository.save(user);
        });
    }

    public AuthResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found"));

        String roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));

        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setRole(roleNames);

        return response;
    }

    public String getEmailFromAccessToken(String accessToken) {
        jwtUtil.validateToken(accessToken);
        return jwtUtil.extractEmail(accessToken);
    }
}
