package com.eproject.petsale.personalization.controller;

import com.eproject.petsale.common.response.ApiSuccessResponse;
import com.eproject.petsale.personalization.dto.BuyerProfileRequest;
import com.eproject.petsale.personalization.dto.BuyerProfileResponse;
import com.eproject.petsale.personalization.entity.BuyerProfile;
import com.eproject.petsale.personalization.service.BuyerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("gupet/api/v1/buyer-profiles")
@RequiredArgsConstructor
public class BuyerProfileController {

    private final BuyerProfileService buyerProfileService;

    @PostMapping
    public ResponseEntity<ApiSuccessResponse<String>> saveProfile(@RequestBody BuyerProfileRequest request) {
        buyerProfileService.saveProfile(request);
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Profile saved successfully", "SUCCESS"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiSuccessResponse<BuyerProfileResponse>> getMyProfile() {
        BuyerProfileResponse profile = buyerProfileService.getMyProfile();
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "My profile", profile));
    }
}
