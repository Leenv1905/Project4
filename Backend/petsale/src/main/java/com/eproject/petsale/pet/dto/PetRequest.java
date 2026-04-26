package com.eproject.petsale.pet.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import jakarta.validation.constraints.Pattern;
import java.util.List;

@Getter
@Setter
public class PetRequest {
    @Pattern(regexp = "^PET-\\d{8}-\\d{4}$", message = "Mã chip thú cưng phải có định dạng PET-YYYYMMDD-XXXX (ví dụ: PET-20260426-0001).")
    private String petCode;
    private String name;
    private String species;
    private String breed;
    private String description;
    private BigDecimal price;
    private Integer minDailyTime;
    private Integer minLivingSpace;
    private Integer minActivityTime;
    private Integer minMonthlyBudget;
    private Integer minExperienceLevel;
    private List<PetImageDTO> images;
}
