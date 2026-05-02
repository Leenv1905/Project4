package com.eproject.petsale.registry.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderVerificationResponse {
    private Long orderId;
    private String orderCode;
    private int totalPetsInOrder;

    private List<PetToVerify> petsToVerify;

    @Data
    @Builder
    public static class PetToVerify {
        private Long petId;
        private String petName;
        private String breed;
        private String petCode;
        private String shopName;
    }
}