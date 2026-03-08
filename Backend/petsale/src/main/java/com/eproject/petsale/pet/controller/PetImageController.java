package com.eproject.petsale.pet.controller;

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

    // API này dùng cơ chế 'multipart/form-data' chuyên dụng cho truyền tải file
    @PostMapping(value = "/{petId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @PathVariable Long petId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrimary", defaultValue = "false") boolean isPrimary,
            @RequestParam(value = "displayOrder", defaultValue = "0") int displayOrder
    ) {
        try {
            petImageService.uploadPetImage(petId, file, isPrimary, displayOrder);
            return ResponseEntity.ok("Tải ảnh thành công!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi tải ảnh lên Cloudflare: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
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
