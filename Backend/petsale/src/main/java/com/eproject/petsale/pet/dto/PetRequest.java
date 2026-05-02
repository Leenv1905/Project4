package com.eproject.petsale.pet.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import jakarta.validation.constraints.Pattern;
import java.util.List;

@Getter
@Setter
public class PetRequest {
    @Pattern(regexp = "^[A-Z0-9]{15}$", message = "Mã chip thú cưng phải gồm đúng 15 ký tự chữ hoa và số (ví dụ: CZAREP8B1LVXNV3).")
    private String petCode;
    private String name;
    private String species;
    private String breed;
    private String description;
    private BigDecimal price;
    private String color;
    private String gender;
    private Double weight;
    private Integer age;
    private Boolean isVaccinated;
    private Boolean isNeutered;
    private Integer minDailyTime;
    private Integer minLivingSpace;
    private Integer minActivityTime;
    private Integer minMonthlyBudget;
    private Integer minExperienceLevel;
    private List<PetImageDTO> images;
}
