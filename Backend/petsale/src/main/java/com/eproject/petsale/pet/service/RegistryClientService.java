package com.eproject.petsale.pet.service;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class RegistryClientService {

    private final RestTemplate restTemplate;

    // URL của Service B (MongoDB)
    private final String REGISTRY_SERVICE_URL = "http://localhost:8081/api/v1/registry/check/";

    public boolean checkPetVerification(String petCode, String token) {
        try {
            String url = REGISTRY_SERVICE_URL + petCode;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token); // dùng token user

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<VerificationResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    VerificationResponse.class
            );

            return response.getBody() != null && response.getBody().isVerified();

        } catch (Exception e) {
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