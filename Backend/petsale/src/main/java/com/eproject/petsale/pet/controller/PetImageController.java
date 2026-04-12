package com.eproject.petsale.pet.controller;

import com.eproject.petsale.pet.dto.GeminiImageRequest;
import com.eproject.petsale.pet.dto.GeminiImageResponse;
import com.eproject.petsale.pet.service.GeminiImageService;
import com.eproject.petsale.pet.service.PetImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetImageController {

    private final PetImageService petImageService;
    private final GeminiImageService geminiImageService;

    @PostMapping("/ai/generate")
    public ResponseEntity<?> generateImageByAI(@RequestBody GeminiImageRequest request) {
        try {
            GeminiImageResponse response = geminiImageService.generateImages(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo ảnh qua AI: " + e.getMessage());
        }
    }

    // API này dùng cơ chế 'multipart/form-data' chuyên dụng cho truyền tải file
    @PostMapping(value = "/{petId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @PathVariable Long petId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrimary", defaultValue = "false") boolean isPrimary,
            @RequestParam(value = "displayOrder", defaultValue = "0") int displayOrder) {
        try {
            petImageService.uploadPetImage(petId, file, isPrimary, displayOrder);
            return ResponseEntity.ok("Tải ảnh thành công!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi tải ảnh lên Cloudflare: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // API này dùng để lưu ảnh sinh ra từ AI (chuỗi Base64) trực tiếp
    @PostMapping("/{petId}/images/base64")
    public ResponseEntity<?> uploadBase64Image(
            @PathVariable Long petId,
            @RequestBody com.eproject.petsale.pet.dto.PetBase64ImageRequest request) {
        try {
            petImageService.uploadBase64PetImage(petId, request.getBase64Image(), request.isPrimary(),
                    request.getDisplayOrder());
            return ResponseEntity.ok("Lưu ảnh AI thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lưu ảnh AI: " + e.getMessage());
        }
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) {
        try {
            petImageService.deletePetImage(imageId);
            return ResponseEntity.ok("Xóa ảnh thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
