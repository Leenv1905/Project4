package com.eproject.petsale.registry.controller;

import com.eproject.petsale.common.response.ApiSuccessResponse;
import com.eproject.petsale.registry.dto.UnassignedPetResponse;
import com.eproject.petsale.registry.dto.VerificationTaskResponse;
import com.eproject.petsale.registry.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    @PreAuthorize("hasRole('OPERATOR')")
    public ResponseEntity<ApiSuccessResponse<List<VerificationTaskResponse>>> getMyTasks() {
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "My tasks", verificationService.getMyTasks()));
    }

    @PostMapping(value = "/{taskId}/upload-chip", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('OPERATOR')")
    public ResponseEntity<ApiSuccessResponse<String>> uploadChip(
            @PathVariable Long taskId,
            @RequestParam("file") MultipartFile file) {
        String url = verificationService.uploadChipImage(taskId, file);
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Chip image uploaded", url));
    }

    @PostMapping("/{taskId}/submit")
    @PreAuthorize("hasRole('OPERATOR')")
    public ResponseEntity<ApiSuccessResponse<String>> submit(@PathVariable Long taskId, @RequestBody Map<String, String> payload) {
        String result = verificationService.submitVerification(taskId, payload.get("chipCode"), payload.get("chipUrl"), payload.get("gps"), payload.get("note"));
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Verification complete", result));
    }

    @PostMapping("/{taskId}/cancel-order")
    @PreAuthorize("hasRole('OPERATOR')")
    public ResponseEntity<ApiSuccessResponse<String>> cancelOrder(@PathVariable Long taskId) {
        verificationService.cancelOrderByTask(taskId);
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Order cancelled", "CANCELLED"));
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

    @GetMapping("/unassigned-pets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiSuccessResponse<List<UnassignedPetResponse>>> getUnassignedPets() {
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Unassigned pets", verificationService.getUnassignedPetsWithOrderContext()));
    }

    @GetMapping("/by-status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiSuccessResponse<List<VerificationTaskResponse>>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Tasks by status", verificationService.getTasksByStatus(status)));
    }

    @PutMapping("/{taskId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiSuccessResponse<String>> approve(@PathVariable Long taskId, @RequestBody Map<String, String> payload) {
        verificationService.approveVerification(taskId, payload.get("feedback"));
        return ResponseEntity.ok(new ApiSuccessResponse<>(200, "Pet verified", "SUCCESS"));
    }
}
