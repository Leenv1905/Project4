package com.eproject.petsale.pet.service;

import com.eproject.petsale.common.service.R2StorageService;
import com.eproject.petsale.pet.entity.Pet;
import com.eproject.petsale.pet.entity.PetImage;
import com.eproject.petsale.pet.repository.PetImageRepository;
import com.eproject.petsale.pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class PetImageService {
    private final PetImageRepository petImageRepository;
    private final PetRepository petRepository;
    private final R2StorageService r2StorageService;

    @Transactional
    public PetImage uploadPetImage(Long petId, MultipartFile file, boolean isPrimary, int displayOrder)
            throws IOException {

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("không tìm thấy thú cưng với ID: " + petId));
        R2StorageService.PetImageUploadResult result = r2StorageService.uploadFile(file, petId);
        PetImage petImage = new PetImage();
        petImage.setPet(pet);
        petImage.setObjectKey(result.objectKey);
        petImage.setImageUrl(result.imageUrl);
        petImage.setPrimary(isPrimary);
        petImage.setDisplayOrder(displayOrder);
        return petImageRepository.save(petImage);
    }

    @Transactional
    public PetImage uploadBase64PetImage(Long petId, String base64Data, boolean isPrimary, int displayOrder) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("không tìm thấy thú cưng với ID: " + petId));

        R2StorageService.PetImageUploadResult result = r2StorageService.uploadBase64Image(base64Data, petId);

        PetImage petImage = new PetImage();
        petImage.setPet(pet);
        petImage.setObjectKey(result.objectKey);
        petImage.setImageUrl(result.imageUrl);
        petImage.setPrimary(isPrimary);
        petImage.setDisplayOrder(displayOrder);

        return petImageRepository.save(petImage);
    }

    @Transactional
    public void deletePetImage(Long imageId) {
        PetImage petImage = petImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("không tìm thấy hình ảnh với ID: " + imageId));
        try {
            r2StorageService.deleteFile(petImage.getObjectKey());
        } catch (Exception e) {
            System.err.println("lỗi khi xóa ảnh trên hệ thống Cloudflare R2: " + e.getMessage());
        }

        petImageRepository.delete(petImage);
    }

}
