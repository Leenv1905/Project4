package com.eproject.petsale.auth.controller;

import com.eproject.petsale.auth.dto.AuthResponse;
import com.eproject.petsale.auth.dto.LoginRequest;
import com.eproject.petsale.auth.dto.RegisterRequest;
import com.eproject.petsale.auth.service.AuthService;
import com.eproject.petsale.common.response.ApiSuccessResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.io.IOException;
import java.security.GeneralSecurityException;

@RestController
@RequestMapping("gupet/v1/auth/user")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiSuccessResponse<AuthResponse>> register(
            @RequestBody RegisterRequest request
    ){

        AuthResponse data = authService.register(request);

        ApiSuccessResponse<AuthResponse> res =
                new ApiSuccessResponse<>(200, "Register success", data);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiSuccessResponse<AuthResponse>> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {

        AuthResponse data = authService.login(request);

        Cookie accessCookie = new Cookie("access_token", data.getAccessToken());
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(60 * 5); // 5 phút

        Cookie refreshCookie = new Cookie("refresh_token", data.getRefreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(60 * 60 * 24 * 7); // 7 ngày

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        data.setAccessToken(null);// không trả về token trong res
        data.setRefreshToken(null);

        ApiSuccessResponse<AuthResponse> res =
                new ApiSuccessResponse<>(200, "Login success", data);

        return ResponseEntity.ok(res);
    }
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = null;

        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {

                if ("refresh_token".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(401).body("Refresh token missing");
        }

        String newAccessToken = authService.refreshAccessToken(refreshToken);

        Cookie accessCookie = new Cookie("access_token", newAccessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(60 * 5);

        response.addCookie(accessCookie);

        return ResponseEntity.ok("Access token refreshed");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;

        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        authService.logout(refreshToken);

        Cookie accessCookie = new Cookie("access_token", "");
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);

        Cookie refreshCookie = new Cookie("refresh_token", "");
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok("Logout success");
    }

    @GetMapping("/me")
    public ResponseEntity<ApiSuccessResponse<AuthResponse>> me(HttpServletRequest request) {
        String accessToken = null;

        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("access_token".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }

        if (accessToken == null || accessToken.isBlank()) {
            return ResponseEntity.status(401).build();
        }

        String email = authService.getEmailFromAccessToken(accessToken);
        AuthResponse data = authService.me(email);

        ApiSuccessResponse<AuthResponse> res =
                new ApiSuccessResponse<>(200, "Current user", data);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/google")
    public ResponseEntity<ApiSuccessResponse<AuthResponse>> googleLogin(
            @RequestBody Map<String, String> payload,
            HttpServletResponse response
    ) throws Exception {
        String idToken = payload.get("idToken");
        AuthResponse data = authService.loginWithGoogle(idToken);

        Cookie accessCookie = new Cookie("access_token", data.getAccessToken());
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(60 * 5);

        Cookie refreshCookie = new Cookie("refresh_token", data.getRefreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(60 * 60 * 24 * 7);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        data.setAccessToken(null);
        data.setRefreshToken(null);

        ApiSuccessResponse<AuthResponse> res =
                new ApiSuccessResponse<>(200, "Google login success", data);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiSuccessResponse<String>> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        authService.forgotPassword(email);
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "OTP sent to email", "SUCCESS"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiSuccessResponse<String>> resetPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");
        String newPassword = payload.get("newPassword");
        authService.resetPassword(email, otp, newPassword);
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Password reset successfully", "SUCCESS"));
    }

}
