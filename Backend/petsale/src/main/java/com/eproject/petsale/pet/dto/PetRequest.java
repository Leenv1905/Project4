package com.eproject.petsale.pet.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class PetRequest {
    private String name;
    private String species;
    private String breed;
    private String description;
    private Integer minDailyTime;
    private Integer minLivingSpace;
    private Integer minActivityTime;
    private Integer minMonthlyBudget;
    private Integer minExperienceLevel;
    private List<PetImageDTO> images;
}
