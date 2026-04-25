package com.eproject.petsale.registry.controller;

import com.eproject.petsale.common.response.ApiSuccessResponse;
import com.eproject.petsale.registry.dto.VerificationTaskResponse;
import com.eproject.petsale.registry.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("gupet/api/v1/verifications")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiSuccessResponse<String>> assignTask(@RequestBody Map<String, Long> payload) {
        verificationService.assignTask(payload.get("petId"), payload.get("operatorId"));
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Task assigned", "SUCCESS"));
    }

    @GetMapping("/my-tasks")
    @PreAuthorize("hasRole('OPERATORS')")
    public ResponseEntity<ApiSuccessResponse<List<VerificationTaskResponse>>> getMyTasks() {
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "My tasks", verificationService.getMyTasks()));
    }

    @PostMapping("/{taskId}/submit")
    @PreAuthorize("hasRole('OPERATORS')")
    public ResponseEntity<ApiSuccessResponse<String>> submit(@PathVariable Long taskId, @RequestBody Map<String, String> payload) {
        verificationService.submitVerification(taskId, payload.get("chipUrl"), payload.get("gps"), payload.get("note"));
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Report submitted", "SUCCESS"));
    }

    @GetMapping("/submitted")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiSuccessResponse<List<VerificationTaskResponse>>> getSubmitted() {
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Submitted tasks", verificationService.getAllSubmittedTasks()));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiSuccessResponse<List<VerificationTaskResponse>>> getPending() {
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Pending tasks", verificationService.getAllPendingTasks()));
    }

    @PutMapping("/{taskId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiSuccessResponse<String>> approve(@PathVariable Long taskId, @RequestBody Map<String, String> payload) {
        verificationService.approveVerification(taskId, payload.get("feedback"));
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Pet verified", "SUCCESS"));
    }
}
