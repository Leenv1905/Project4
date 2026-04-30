package com.eproject.registry.service;


import com.eproject.registry.dto.PetExcelDTO;
import com.eproject.registry.dto.PetImportRequest;
import com.eproject.registry.entity.Pet;
import com.eproject.registry.mapper.PetMapper;
import com.eproject.registry.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class RegistryService {

    private final PetRepository petRepository;
    private final PetMapper petMapper;

    public VerificationResponse checkPet(String petCode) {

        Pet pet = petRepository.findByPetCode(petCode)
                .orElse(null);

        if (pet == null) {
            return new VerificationResponse(false, null);
        }

        return new VerificationResponse(
                pet.isVerified(),
                pet.getPetName()
        );
    }

    // DTO trả về giống Service A đang nhận
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class VerificationResponse {
        private boolean isVerified;
        private String petName;
    }

    public void importPet(PetImportRequest request) {

        Pet pet = new Pet();

        pet.setPetCode(request.getPetCode());
        pet.setPetName(request.getPetName());
        pet.setAge(request.getAge());
        pet.setColor(request.getColor());
        pet.setPersonality(request.getPersonality());
        pet.setVaccinationRecord(request.getVaccinationRecord());
        pet.setHealthRecord(request.getHealthRecord());
        pet.setBreed(request.getBreed());
        pet.setGender(request.getGender());
        pet.setWeight(request.getWeight());

        pet.setVerified(true); // mặc định đã xác minh

        petRepository.save(pet);
    }

    public void importFromExcel(MultipartFile file) {

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {

                Row row = sheet.getRow(i);
                if (row == null) continue;

                // map trực tiếp từ Excel → DTO
                PetExcelDTO dto = petMapper.toDTO(row);

                // validate
                if (!dto.getPetCode().matches("^[A-Z0-9]{15}$")) continue;
                if (petRepository.existsByPetCode(dto.getPetCode())) continue;

                // DTO → Entity
                Pet pet = petMapper.toEntity(dto);

                petRepository.save(pet);
            }
        } catch (Exception e) {
            e.printStackTrace(); // bắt buộc để thấy lỗi thật
            throw new RuntimeException("Import failed", e);
        }
    }

}