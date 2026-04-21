package com.eproject.petsale.registry.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "mock_microchip_registry")
public class MockMicrochipRegistry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String breed;
    private String color;

    @Column(name = "country_of_origin", length = 50)
    private String countryOfOrigin;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;

    @Column(name = "dna_profile", length = 100)
    private String dnaProfile;

    @Column(name = "father_name", length = 150)
    private String fatherName;

    @Column(length = 20)
    private String gender;

    @Column(name = "health_status", length = 100)
    private String healthStatus;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "microchip_number", nullable = false, length = 50, unique = true)
    private String microchipNumber;

    @Column(name = "mother_name", length = 150)
    private String motherName;

    @Column(length = 100)
    private String organization;

    @Column(name = "owner_name", length = 150)
    private String ownerName;

    @Column(name = "pet_name", length = 100)
    private String petName;

    @Column(name = "registered_date")
    private LocalDateTime registeredDate;
}
