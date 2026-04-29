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
    private Integer age;
    private String color;
    private String gender;
    private String status;
    private Double weight;
    private Integer trustScore;
    private Boolean isHealthVerified;
    private Boolean isPedigreeVerified;
    private Boolean isNeutered;
    private Boolean isVaccinated;
    private List<PetImageDTO> images;
    private Boolean isVerified;
}
