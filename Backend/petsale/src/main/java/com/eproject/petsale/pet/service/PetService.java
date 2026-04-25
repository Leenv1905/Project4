package com.eproject.petsale.pet.service;

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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final com.eproject.petsale.personalization.repository.BuyerProfileRepository buyerProfileRepository;

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
        pet.setPrice(request.getPrice());
        pet.setPetCode(generatePetCode(request.getSpecies()));
        pet.setUser(currentUser);
        pet.setIsVerified(false); // Mặc định là false
        pet.setStatus("PENDING"); // Mặc định là PENDING cho đến khi được duyệt

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
        pet.setSpecies(request.getSpecies());
        pet.setBreed(request.getBreed());
        pet.setDescription(request.getDescription());
        pet.setPrice(request.getPrice());
        
        PetRequirement requirement = pet.getRequirements();
        if (requirement == null) {
            requirement = new PetRequirement();
            requirement.setPet(pet);
        }
        requirement.setMinDailyTime(request.getMinDailyTime());
        requirement.setMinLivingSpace(request.getMinLivingSpace());
        requirement.setMinActivityTime(request.getMinActivityTime());
        requirement.setMinMonthlyBudget(request.getMinMonthlyBudget());
        requirement.setMinExperienceLevel(request.getMinExperienceLevel());
        pet.setRequirements(requirement);

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
        response.setPrice(pet.getPrice());
        response.setDescription(pet.getDescription());
        response.setCreatedAt(pet.getCreatedAt());
        response.setOwnerId(pet.getUser().getId());
        response.setOwnerName(pet.getUser().getName());
        response.setIsVerified(pet.getIsVerified());
        
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
        return petRepository.findByIsVerifiedTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToPublicResponse)
                .collect(Collectors.toList());
    }

    private PetPublicResponse mapToPublicResponse(Pet pet) {
        PetPublicResponse response = new PetPublicResponse();
        response.setId(pet.getId());
        response.setPetCode(pet.getPetCode());
        response.setName(pet.getName());
        response.setSpecies(pet.getSpecies());
        response.setBreed(pet.getBreed());
        response.setPrice(pet.getPrice());
        response.setIsVerified(pet.getIsVerified());
        response.setTrustScore(pet.getTrustScore());
        response.setIsHealthVerified(pet.getIsHealthVerified());
        response.setIsPedigreeVerified(pet.getIsPedigreeVerified());
        response.setCreatedAt(pet.getCreatedAt());

        if (pet.getUser() != null) {
            response.setShopId(pet.getUser().getId());
            response.setShopName(pet.getUser().getName());
        }

        if (pet.getImages() != null && !pet.getImages().isEmpty()) {
            PetImage primary = pet.getImages().stream()
                    .filter(PetImage::isPrimary)
                    .findFirst()
                    .orElse(pet.getImages().get(0));
            response.setImageUrl(primary.getImageUrl());
        }

        response.setStatus(pet.getStatus() != null ? pet.getStatus().toLowerCase() : "pending");
        response.setGender("male");
        response.setColor("");
        response.setWeight(0.0);
        response.setAge(null);

        return response;
    }

    public List<PetPublicResponse> getRecommendedPets() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || email.equals("anonymousUser")) {
            return getAllPublicPets();
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return getAllPublicPets();

        com.eproject.petsale.personalization.entity.BuyerProfile profile = buyerProfileRepository.findById(user.getId()).orElse(null);
        if (profile == null) return getAllPublicPets();

        List<Pet> verifiedPets = petRepository.findByIsVerifiedTrueOrderByCreatedAtDesc();

        return verifiedPets.stream()
                .map(pet -> {
                    PetPublicResponse response = mapToPublicResponse(pet);
                    response.setMatchScore(calculateMatchScore(profile, pet.getRequirements()));
                    return response;
                })
                .sorted((p1, p2) -> Double.compare(p2.getMatchScore(), p1.getMatchScore()))
                .limit(10)
                .collect(Collectors.toList());
    }

    private double calculateMatchScore(com.eproject.petsale.personalization.entity.BuyerProfile profile, PetRequirement req) {
        if (req == null) return 50.0;

        double score = 100.0;

        if (profile.getLivingSpace() < req.getMinLivingSpace()) {
            score -= 20;
        }
        if (profile.getDailyTime() < req.getMinDailyTime()) {
            score -= 20;
        }
        if (profile.getExperienceLevel() < req.getMinExperienceLevel()) {
            score -= 20;
        }
        if (profile.getMonthlyBudget() < req.getMinMonthlyBudget()) {
            score -= 15;
        }

        return Math.max(0, score);
    }
}
