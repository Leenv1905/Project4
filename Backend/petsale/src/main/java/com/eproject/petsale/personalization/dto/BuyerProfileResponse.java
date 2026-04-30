package com.eproject.petsale.personalization.dto;


import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class BuyerProfileResponse {
    private Long userId;
    private String name; // Lấy từ User entity
    private String email; // Lấy từ User entity
    private Integer dailyTime;
    private Integer livingSpace;
    private Integer activityTime;
    private Integer monthlyBudget;
    private Integer experienceLevel;
    private LocalDateTime createdAt;
}