package com.eproject.petsale.pet.service;

import com.eproject.petsale.common.mapper.PetPublicMapper;
import com.eproject.petsale.pet.dto.PetImageDTO;
import com.eproject.petsale.pet.dto.PetPublicResponse;
import com.eproject.petsale.pet.dto.PetRequest;
import com.eproject.petsale.pet.dto.PetResponse;
import com.eproject.petsale.pet.entity.Pet;
import com.eproject.petsale.pet.entity.PetImage;
import com.eproject.petsale.pet.entity.PetRequirement;
import com.eproject.petsale.pet.repository.PetRepository;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final PetPublicMapper petPublicMapper;
    @Transactional
    public PetResponse createPet(PetRequest request) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + email));

        Pet pet = new Pet();
        pet.setName(request.getName());
        pet.setSpecies(request.getSpecies());
        pet.setBreed(request.getBreed());
        pet.setDescription(request.getDescription());
        pet.setPetCode(generatePetCode(request.getSpecies()));
        pet.setUser(currentUser);

        PetRequirement requirement = new PetRequirement();
        requirement.setPet(pet);
        requirement.setMinDailyTime(request.getMinDailyTime());
        requirement.setMinLivingSpace(request.getMinLivingSpace());
        requirement.setMinActivityTime(request.getMinActivityTime());
        requirement.setMinMonthlyBudget(request.getMinMonthlyBudget());
        requirement.setMinExperienceLevel(request.getMinExperienceLevel());
        pet.setRequirements(requirement);

        if (request.getImages() != null) {
            List<PetImage> images = request.getImages().stream().map(imgDto -> {
                PetImage img = new PetImage();
                img.setPet(pet);
                img.setImageUrl(imgDto.getImageUrl());
                img.setObjectKey(imgDto.getObjectKey());
                img.setPrimary(imgDto.isPrimary());
                img.setDisplayOrder(imgDto.getDisplayOrder());
                return img;
            }).collect(Collectors.toList());
            pet.setImages(images);
        }

        Pet savedPet = petRepository.save(pet);
        return mapToResponse(savedPet);
    }

    public List<PetResponse> getAllPets() {
        return petRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PetResponse> getMyPets() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return petRepository.findByUserEmail(email).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PetResponse getPetById(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));
        return mapToResponse(pet);
    }

    @Transactional
    public PetResponse updatePet(Long id, PetRequest request) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!pet.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa thú cưng này.");
        }

        pet.setName(request.getName());
        pet.setBreed(request.getBreed());
        pet.setDescription(request.getDescription());
        PetRequirement requirement = pet.getRequirements();
        requirement.setMinDailyTime(request.getMinDailyTime());
        requirement.setMinLivingSpace(request.getMinLivingSpace());
        requirement.setMinActivityTime(request.getMinActivityTime());
        requirement.setMinMonthlyBudget(request.getMinMonthlyBudget());
        requirement.setMinExperienceLevel(request.getMinExperienceLevel());

        if (request.getImages() != null) {
            pet.getImages().clear();
            List<PetImage> newImages = request.getImages().stream().map(imgDto -> {
                PetImage img = new PetImage();
                img.setPet(pet);
                img.setImageUrl(imgDto.getImageUrl());
                img.setObjectKey(imgDto.getObjectKey());
                img.setPrimary(imgDto.isPrimary());
                img.setDisplayOrder(imgDto.getDisplayOrder());
                return img;
            }).collect(Collectors.toList());
            pet.getImages().addAll(newImages);
        }

        Pet savedPet = petRepository.save(pet);
        return mapToResponse(savedPet);
    }

    @Transactional
    public void deletePet(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!pet.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Bạn không có quyền xóa thú cưng này.");
        }

        petRepository.delete(pet);
    }

    private PetResponse mapToResponse(Pet pet) {
        PetResponse response = new PetResponse();
        response.setId(pet.getId());
        response.setPetCode(pet.getPetCode());
        response.setName(pet.getName());
        response.setSpecies(pet.getSpecies());
        response.setBreed(pet.getBreed());
        response.setDescription(pet.getDescription());
        response.setCreatedAt(pet.getCreatedAt());
        response.setOwnerId(pet.getUser().getId());
        response.setOwnerName(pet.getUser().getName());
        if (pet.getRequirements() != null) {
            response.setMinDailyTime(pet.getRequirements().getMinDailyTime());
            response.setMinLivingSpace(pet.getRequirements().getMinLivingSpace());
            response.setMinActivityTime(pet.getRequirements().getMinActivityTime());
            response.setMinMonthlyBudget(pet.getRequirements().getMinMonthlyBudget());
            response.setMinExperienceLevel(pet.getRequirements().getMinExperienceLevel());
        }

        if (pet.getImages() != null) {
            response.setImages(pet.getImages().stream().map(img -> {
                PetImageDTO dto = new PetImageDTO();
                dto.setImageUrl(img.getImageUrl());
                dto.setObjectKey(img.getObjectKey());
                dto.setPrimary(img.isPrimary());
                dto.setDisplayOrder(img.getDisplayOrder());
                return dto;
            }).collect(Collectors.toList()));
        }

        return response;
    }

    private String generatePetCode(String species) {
        String prefix = species.toUpperCase().substring(0, Math.min(species.length(), 3));
        String randomNum = String.valueOf((int) (Math.random() * 90000) + 10000);
        return prefix + "-" + randomNum;
    }

    public List<PetPublicResponse> getAllPublicPets() {
        return petPublicMapper.toResponseList(
                petRepository.findByIsVerifiedTrueOrderByCreatedAtDesc()
        );
    }
}
