package com.eproject.petsale.user.controller;

import com.eproject.petsale.common.mapper.UserAddressMapper;
import com.eproject.petsale.user.dto.CreateAddressRequest;
import com.eproject.petsale.user.dto.RegisterSellerRequest;
import com.eproject.petsale.user.dto.UpdateProfileRequest;
import com.eproject.petsale.user.dto.UserAddressResponse;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.entity.UserAddress;
import com.eproject.petsale.user.repository.UserAddressRepository;
import com.eproject.petsale.user.repository.UserRepository;
import com.eproject.petsale.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/gupet/v1/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserAddressRepository userAddressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAddressMapper userAddressMapper;


    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {

        var profile = userService.getMyProfile();

        if (profile == null) {
            throw new IllegalArgumentException("User profile not found");
        }

        List<UserAddress> addresses = userAddressRepository.findByUserEmail(authentication.getName());
        profile.setAddresses(userAddressMapper.toResponseList(addresses));

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @RequestBody UpdateProfileRequest request
    ) {

        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        var updatedUser = userService.updateMyProfile(request);

        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/addresses")
    public List<UserAddressResponse> getMyAddresses(Authentication authentication) {

        String email = authentication.getName();

        List<UserAddress> addresses = userAddressRepository.findByUserEmail(email);

        return userAddressMapper.toResponseList(addresses);
    }

    @PostMapping("/addresses")
    public UserAddressResponse createAddress(
            @RequestBody CreateAddressRequest req,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ xử lý default trước
        if (Boolean.TRUE.equals(req.getIsDefault())) {
            List<UserAddress> list = userAddressRepository.findByUserId(user.getId());
            list.forEach(a -> a.setIsDefault(false));
            userAddressRepository.saveAll(list);
        }

        // ✅ dùng mapper
        UserAddress address = userAddressMapper.toEntity(req);

        // set field không có trong request
        address.setUser(user);

        UserAddress saved = userAddressRepository.save(address);

        // trả DTO
        return userAddressMapper.toResponse(saved);
    }
    @PostMapping("/register-seller")
    public ResponseEntity<?> registerSeller(@RequestBody RegisterSellerRequest request) {
        if (request.getDisplayName() == null || request.getDisplayName().isBlank()) {
            throw new IllegalArgumentException("Tên cửa hàng không được để trống");
        }

        var sellerProfile = userService.registerAsSeller(request);
        return ResponseEntity.ok(sellerProfile);
    }
}