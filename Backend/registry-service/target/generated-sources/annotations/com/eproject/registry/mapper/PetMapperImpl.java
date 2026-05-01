package com.eproject.registry.mapper;

import com.eproject.registry.dto.PetExcelDTO;
import com.eproject.registry.entity.Pet;
import javax.annotation.processing.Generated;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-01T08:55:54+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Microsoft)"
)
@Component
public class PetMapperImpl implements PetMapper {

    @Override
    public PetExcelDTO toDTO(Row row) {
        if ( row == null ) {
            return null;
        }

        PetExcelDTO petExcelDTO = new PetExcelDTO();

        petExcelDTO.setPetCode( getCellValue(row.getCell(0)) );
        petExcelDTO.setPetName( getCellValue(row.getCell(1)) );
        petExcelDTO.setAge( (int) row.getCell(2).getNumericCellValue() );
        petExcelDTO.setColor( getCellValue(row.getCell(3)) );
        petExcelDTO.setPersonality( getCellValue(row.getCell(4)) );
        petExcelDTO.setVaccinationRecord( getCellValue(row.getCell(5)) );
        petExcelDTO.setHealthRecord( getCellValue(row.getCell(6)) );
        petExcelDTO.setBreed( getCellValue(row.getCell(7)) );
        petExcelDTO.setGender( getCellValue(row.getCell(8)) );
        petExcelDTO.setWeight( row.getCell(9).getNumericCellValue() );

        return petExcelDTO;
    }

    @Override
    public Pet toEntity(PetExcelDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Pet pet = new Pet();

        pet.setPetCode( dto.getPetCode() );
        pet.setPetName( dto.getPetName() );
        pet.setAge( dto.getAge() );
        pet.setColor( dto.getColor() );
        pet.setPersonality( dto.getPersonality() );
        pet.setVaccinationRecord( dto.getVaccinationRecord() );
        pet.setHealthRecord( dto.getHealthRecord() );
        pet.setBreed( dto.getBreed() );
        pet.setGender( dto.getGender() );
        pet.setWeight( dto.getWeight() );

        pet.setVerified( true );

        return pet;
    }
}
