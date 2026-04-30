package com.eproject.registry.controller;



import com.eproject.registry.dto.PetImportRequest;
import com.eproject.registry.service.RegistryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/registry")
@RequiredArgsConstructor
public class RegistryController {

    private final RegistryService registryService;

    @GetMapping("/check/{petCode}")
    public RegistryService.VerificationResponse checkPet(
            @PathVariable String petCode
    ) {
        return registryService.checkPet(petCode);
    }
    @PostMapping("/import")
    public String importPet(@RequestBody PetImportRequest request) {

        registryService.importPet(request);

        return "Import success";
    }
    @PostMapping("/import-excel")
    public String importExcel(@RequestParam("file") MultipartFile file) {
        registryService.importFromExcel(file);
        return "Import Excel success";
    }
}