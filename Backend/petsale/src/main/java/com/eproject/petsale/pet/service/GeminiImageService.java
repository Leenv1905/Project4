package com.eproject.petsale.pet.service;

import com.eproject.petsale.pet.dto.GeminiImageRequest;
import com.eproject.petsale.pet.dto.GeminiImageResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiImageService {

    @Value("${google.gemini.api-key}")
    private String apiKey;

    @Value("${google.gemini.api-url}")
    private String apiUrl;

    private final ObjectMapper objectMapper;

    public GeminiImageResponse generateImages(GeminiImageRequest request) {
        String url = apiUrl + "?key=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        GeminiImageResponse response = new GeminiImageResponse();

        try {
            // Chuẩn bị payload theo chuẩn API của Imagen
            // Body có dạng: { "instances": [{"prompt": "..."}], "parameters":
            // {"sampleCount": 1} }
            Map<String, Object> body = new HashMap<>();

            Map<String, String> instance = new HashMap<>();
            instance.put("prompt", request.getPrompt());

            List<Map<String, String>> instances = new ArrayList<>();
            instances.add(instance);

            body.put("instances", instances);

            Map<String, Integer> parameters = new HashMap<>();
            parameters.put("sampleCount", 1);
            body.put("parameters", parameters);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // Gửi request POST
            String jsonResponse = restTemplate.postForObject(url, entity, String.class);

            // Phân tích cú pháp JSON trả về
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode predictions = rootNode.path("predictions");

            List<String> base64Images = new ArrayList<>();
            if (predictions.isArray()) {
                for (JsonNode prediction : predictions) {
                    JsonNode bytesBase64Encoded = prediction.path("bytesBase64Encoded");
                    if (!bytesBase64Encoded.isMissingNode()) {
                        base64Images.add(bytesBase64Encoded.asText());
                    }
                }
            }

            response.setBase64Images(base64Images);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi gọi API tạo ảnh: " + e.getMessage());
        }

        return response;
    }
}
