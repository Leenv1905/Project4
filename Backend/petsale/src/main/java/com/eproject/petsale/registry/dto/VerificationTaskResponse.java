package com.eproject.petsale.registry.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class VerificationTaskResponse {
    private Long id;
    private PetInfo pet;
    private OperatorInfo operator;
    private String status;
    private LocalDateTime assignedAt;
    private LocalDateTime completedAt;
    private String scannedChipCode;
    private String scannedChipImageUrl;
    private String locationGps;
    private String healthNote;
    private String adminFeedback;
    private String deliveryImageUrl;

    @Data
    @Builder
    public static class PetInfo {
        private Long id;
        private String name;
        private String petCode;
        private String breed;
        private java.math.BigDecimal price;
        private String ownerName;
    }

    @Data
    @Builder
    public static class OperatorInfo {
        private Long id;
        private String name;
        private String email;
    }
}
