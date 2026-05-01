package com.eproject.petsale.registry.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnassignedPetResponse {
    private Long petId;
    private String petName;
    private String breed;
    private String petCode;
    private String shopName;

    // Order context
    private Long orderId;
    private String orderCode;
    private int totalPetsInOrder;
    private int verifiedPetsInOrder;
}