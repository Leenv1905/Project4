package com.eproject.petsale.pet.controller;

import com.eproject.petsale.pet.dto.PetPublicResponse;
import com.eproject.petsale.pet.dto.PetRequest;
import com.eproject.petsale.pet.dto.PetResponse;
import com.eproject.petsale.pet.dto.PetImageDTO; // Đảm bảo đã import DTO mới
import com.eproject.petsale.pet.service.PetService;
import com.eproject.petsale.pet.service.AiImageService; // Import service AI mới
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/gupet/api/v1/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;
    private final AiImageService aiImageService; // Tiêm AiImageService vào đây

    /**
     * API này được gọi mỗi khi người dùng bấm nút "Tạo ảnh bằng AI" ở Front-end.
     * Mỗi lần gọi thành công sẽ tính là 1 lượt dùng.
     */
    @PostMapping(value = "/ai-render", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> renderAiImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("style") String style) {

        // Gọi service xử lý file trực tiếp
        String tempAiUrl = aiImageService.renderAiPreview(file, style);

        Map<String, String> response = new HashMap<>();
        response.put("tempAiUrl", tempAiUrl);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<PetResponse> createPet(@RequestBody PetRequest request) {
        // Lúc này trong request.getImages() sẽ chứa link ảnh AI đã được "chốt"
        PetResponse response = petService.createPet(request);
        return ResponseEntity.ok(response);
    }

    // --- Các phương thức khác giữ nguyên ---
    @GetMapping
    public ResponseEntity<List<PetResponse>> getAllPets() {
        return ResponseEntity.ok(petService.getAllPets());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<PetResponse>> getMyPets() {
        return ResponseEntity.ok(petService.getMyPets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetResponse> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getPetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetResponse> updatePet(@PathVariable Long id, @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.updatePet(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/public")
    public ResponseEntity<List<PetPublicResponse>> getAllPublicPets() {
        return ResponseEntity.ok(petService.getAllPublicPets());
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<PetPublicResponse>> getRecommendedPets() {
        return ResponseEntity.ok(petService.getRecommendedPets());
    }
}
