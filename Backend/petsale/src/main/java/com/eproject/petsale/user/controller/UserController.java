package com.eproject.petsale.user.controller;

import com.eproject.petsale.user.dto.UpdateProfileRequest;
import com.eproject.petsale.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/gupet/v1/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {

        var profile = userService.getMyProfile();

        if (profile == null) {
            throw new IllegalArgumentException("User profile not found");
        }

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @RequestBody UpdateProfileRequest request
    ){

        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        var updatedUser = userService.updateMyProfile(request);

        return ResponseEntity.ok(updatedUser);
    }
}