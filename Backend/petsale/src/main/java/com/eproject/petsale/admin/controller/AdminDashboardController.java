package com.eproject.petsale.admin.controller;

import com.eproject.petsale.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gupet/v1/api/admin/dashboard")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')") // Uncomment when security is ready
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/revenue-chart")
    public ResponseEntity<?> getRevenueChart() {
        return ResponseEntity.ok(dashboardService.getRevenueChartData());
    }
}
