package com.eproject.petsale.pet.dto;

import lombok.Data;

@Data
public class PetBase64ImageRequest {
    private String base64Image;
    private boolean isPrimary = false;
    private int displayOrder = 0;
}
