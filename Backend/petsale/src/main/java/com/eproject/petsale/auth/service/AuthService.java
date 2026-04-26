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
import com.eproject.petsale.auth.entity.OtpVerification;
import com.eproject.petsale.auth.entity.SsoAccount;
import com.eproject.petsale.auth.repository.OtpVerificationRepository;
import com.eproject.petsale.auth.repository.SsoAccountRepository;
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

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SsoAccountRepository ssoAccountRepository;

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

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

        // ✅ FIX: Xử lý Optional từ RoleRepository
        Role role = roleRepository.findByName("ROLE_BUYER") // Thường là ROLE_BUYER hoặc ROLE_USER
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("ROLE_BUYER");
                    return roleRepository.save(newRole);
                });

        user.getRoles().add(role);
        userRepository.save(user);

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

        String roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));

        String accessToken = jwtUtil.generateToken(user.getEmail(), roleNames);
        String refreshToken = UUID.randomUUID().toString();
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        AuthResponse res = new AuthResponse();
        res.setAccessToken(accessToken);
        res.setRefreshToken(refreshToken);
        res.setUserId(user.getId());
        res.setName(user.getName());
        res.setRole(roleNames);

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

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            throw new AuthException("User has no roles assigned");
        }

        String roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));

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

    @Transactional
    public AuthResponse loginWithGoogle(String idToken) throws Exception {
        com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = googleAuthService.verifyToken(idToken);
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String googleId = payload.getSubject();

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);

            // ✅ FIX: Xử lý Optional cho Google Login
            Role role = roleRepository.findByName("ROLE_BUYER")
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName("ROLE_BUYER");
                        return roleRepository.save(r);
                    });

            newUser.getRoles().add(role);
            return userRepository.save(newUser);
        });

        if (ssoAccountRepository.findByProviderAndProviderUserId("GOOGLE", googleId).isEmpty()) {
            SsoAccount sso = new SsoAccount();
            sso.setProvider("GOOGLE");
            sso.setProviderUserId(googleId);
            sso.setUser(user);
            ssoAccountRepository.save(sso);
        }

        String roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));

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

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found"));

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        OtpVerification otpEntry = otpVerificationRepository.findByUserIdAndOtpType(user.getId(), "FORGOT_PASSWORD")
                .orElse(new OtpVerification());

        otpEntry.setUser(user);
        otpEntry.setOtpCode(otp);
        otpEntry.setOtpType("FORGOT_PASSWORD");
        otpEntry.setExpiresAt(java.time.LocalDateTime.now().plusMinutes(15));
        otpEntry.setVerified(false);

        otpVerificationRepository.save(otpEntry);
        emailService.sendOtp(email, otp);
    }

    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found"));

        OtpVerification otpEntry = otpVerificationRepository.findByUserIdAndOtpType(user.getId(), "FORGOT_PASSWORD")
                .orElseThrow(() -> new AuthException("OTP not found"));

        if (!otpEntry.getOtpCode().equals(otp) || otpEntry.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new AuthException("Invalid or expired OTP");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpEntry.setVerified(true);
        otpVerificationRepository.save(otpEntry);
    }
    public String getEmailFromAccessToken(String accessToken) {
        // Kiểm tra tính hợp lệ của token trước khi trích xuất
        jwtUtil.validateToken(accessToken);
        // Trích xuất email từ claims của token
        return jwtUtil.extractEmail(accessToken);
    }
}