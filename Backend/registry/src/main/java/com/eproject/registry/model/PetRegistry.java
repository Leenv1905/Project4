package com.eproject.registry.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.List;

@Data
@Document(collection = "pet_registries")
public class PetRegistry {
    @Id
    private String id;

    @Indexed(unique = true) // Đánh chỉ mục để tìm mã chip cực nhanh
    private String petCode;

    private String petName;
    private String breed;

    // Danh sách sổ tiêm (Căn cứ xác minh chính của bạn)
    private List<VaccinationRecord> vaccinations;

    // Thông tin gia phả
    private PedigreeInfo pedigree;

    @Data
    public static class VaccinationRecord {
        private String vaccineName;
        private LocalDate dateAdministered;
        private String clinicName;
        private String batchNumber;
    }

    @Data
    public static class PedigreeInfo {
        private String vkaCode;
        private String fatherCode;
        private String motherCode;
        private String breeder;
    }
}