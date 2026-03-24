package com.eproject.petsale.pet.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class RegistryClientService {

    private final RestTemplate restTemplate;

    // URL của Service B (MongoDB)
    private final String REGISTRY_SERVICE_URL = "http://localhost:8081/api/v1/registry/check/";

    public boolean checkPetVerification(String petCode) {
        try {
            // Gọi GET sang Service B
            VerificationResponse response = restTemplate.getForObject(
                    REGISTRY_SERVICE_URL + petCode,
                    VerificationResponse.class
            );

            return response != null && response.isVerified();
        } catch (Exception e) {
            // Nếu Service B sập hoặc lỗi, mặc định là false
            return false;
        }
    }

    // Class hứng dữ liệu trả về từ JSON của Service B
    @lombok.Data
    public static class VerificationResponse {
        private boolean isVerified;
        private String petName;
    }
}