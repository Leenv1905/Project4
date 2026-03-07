package com.eproject.petsale.pet.controller;

import com.eproject.petsale.pet.dto.PetRequest;
import com.eproject.petsale.pet.dto.PetResponse;
import com.eproject.petsale.pet.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping
    public ResponseEntity<PetResponse> createPet(@RequestBody PetRequest request) {
        PetResponse response = petService.createPet(request);
        return ResponseEntity.ok(response);
    }
}
