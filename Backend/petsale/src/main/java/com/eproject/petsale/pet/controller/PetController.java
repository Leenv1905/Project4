package com.eproject.petsale.pet.controller;

import com.eproject.petsale.pet.dto.PetPublicResponse;
import com.eproject.petsale.pet.dto.PetRequest;
import com.eproject.petsale.pet.dto.PetResponse;
import com.eproject.petsale.pet.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gupet/api/v1/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping
    public ResponseEntity<PetResponse> createPet(@RequestBody PetRequest request) {
        PetResponse response = petService.createPet(request);
        return ResponseEntity.ok(response);
    }

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
