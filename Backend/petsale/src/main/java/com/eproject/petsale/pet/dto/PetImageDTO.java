package com.eproject.petsale.pet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetImageDTO {
    private String imageUrl;
    private String objectKey;
    private boolean isPrimary;
    private int displayOrder;
}
