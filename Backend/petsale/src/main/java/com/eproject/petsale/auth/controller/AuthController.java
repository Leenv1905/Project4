package com.eproject.petsale.auth.controller;

import com.eproject.petsale.auth.dto.AuthResponse;
import com.eproject.petsale.auth.dto.LoginRequest;
import com.eproject.petsale.auth.dto.RegisterRequest;
import com.eproject.petsale.auth.service.AuthService;
import com.eproject.petsale.common.response.ApiSuccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/user")
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
    public AuthResponse login(@RequestBody LoginRequest request) {

        return authService.login(request);

    }

}