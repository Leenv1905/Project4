package com.eproject.petsale.pet.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PetResponse {
    private Long id;
    private String petCode;
    private String name;
    private String species;
    private String breed;
    private BigDecimal price;
    private String description;
    private LocalDateTime createdAt;
    private Long ownerId;
    private String ownerName;
    private Integer minDailyTime;
    private Integer minLivingSpace;
    private Integer minActivityTime;
    private Integer minMonthlyBudget;
    private Integer minExperienceLevel;
    private List<PetImageDTO> images;
    private Boolean isVerified;
}
