package com.eproject.petsale.pet.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PetPublicResponse {

    private Long id;
    private String petCode;
    private String name;
    private String species;
    private String breed;
    private BigDecimal price;

    private String imageUrl;

    private String status;
    private String gender;
    private String color;
    private Double weight;
    private Integer age;

    private Long shopId;
    private String shopName;

    private Boolean isVerified;
    private Integer trustScore;

    private Boolean isHealthVerified;
    private Boolean isPedigreeVerified;

    private Double matchScore;

    private LocalDateTime createdAt;
}
