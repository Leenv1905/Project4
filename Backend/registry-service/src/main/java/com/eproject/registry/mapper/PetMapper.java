package com.eproject.registry.mapper;

import com.eproject.registry.dto.PetExcelDTO;
import com.eproject.registry.entity.Pet;
import org.apache.poi.ss.usermodel.Row;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PetMapper {

    // map Row -> DTO
    @Mapping(target = "petCode", expression = "java(getCellValue(row.getCell(0)))")
    @Mapping(target = "petName", expression = "java(getCellValue(row.getCell(1)))")
    @Mapping(target = "age", expression = "java((int) row.getCell(2).getNumericCellValue())")
    @Mapping(target = "color", expression = "java(getCellValue(row.getCell(3)))")
    @Mapping(target = "personality", expression = "java(getCellValue(row.getCell(4)))")
    @Mapping(target = "vaccinationRecord", expression = "java(getCellValue(row.getCell(5)))")
    @Mapping(target = "healthRecord", expression = "java(getCellValue(row.getCell(6)))")
    @Mapping(target = "breed", expression = "java(getCellValue(row.getCell(7)))")
    @Mapping(target = "gender", expression = "java(getCellValue(row.getCell(8)))")
    @Mapping(target = "weight", expression = "java(row.getCell(9).getNumericCellValue())")
    PetExcelDTO toDTO(Row row);

    // DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "verified", constant = "true")
    Pet toEntity(PetExcelDTO dto);

    // helper dùng trong expression
    default String getCellValue(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            default:
                return "";
        }
    }
}