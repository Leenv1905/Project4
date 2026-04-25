package com.eproject.petsale.personalization.dto;

import lombok.Data;

@Data
public class BuyerProfileRequest {
    private Integer dailyTime;
    private Integer livingSpace;
    private Integer activityTime;
    private Integer monthlyBudget;
    private Integer experienceLevel;
}
