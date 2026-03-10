package com.eproject.petsale.pet.dto;

import lombok.Data;
import java.util.List;

@Data
public class GeminiImageResponse {
    private List<String> base64Images;
}
