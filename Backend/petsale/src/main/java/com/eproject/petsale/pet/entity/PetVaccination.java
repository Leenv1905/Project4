package com.eproject.petsale.pet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "pet_vaccinations")
public class PetVaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "vaccine_name", nullable = false)
    private String vaccineName;

    @Column(name = "vaccination_date", nullable = false)
    private LocalDate vaccinationDate;

    @Column(name = "clinic_name")
    private String clinicName;

    @Column(name = "sticker_image_url", columnDefinition = "TEXT")
    private String stickerImageUrl;

    @Column(name = "is_verified_by_admin", columnDefinition = "tinyint(1) default 1")
    private Boolean isVerifiedByAdmin;
}
