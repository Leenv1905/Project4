package com.eproject.registry.controller;

import com.eproject.registry.repository.PetRegistryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/registry")
@RequiredArgsConstructor
public class RegistryController {

    private final PetRegistryRepository repository;

    @GetMapping("/check/{petCode}")
    public ResponseEntity<?> checkPetStatus(@PathVariable String petCode) {
        return repository.findByPetCode(petCode)
                .map(pet -> ResponseEntity.ok().body(new VerificationResult(true, pet.getPetName())))
                .orElse(ResponseEntity.ok().body(new VerificationResult(false, null)));
    }

    // Class nội bộ để trả về JSON cho gọn
    record VerificationResult(boolean isVerified, String petName) {}

}