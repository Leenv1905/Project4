package com.eproject.petsale.pet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "pet_certificates")
public class PetCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "microchip_number", nullable = false, length = 50, unique = true)
    private String microchipNumber;

    @Column(name = "certificate_number", length = 100)
    private String certificateNumber;

    @Column(name = "organization_name", length = 100)
    private String organizationName;

    @Column(name = "is_champion_line", columnDefinition = "tinyint(1) default 0")
    private Boolean isChampionLine;

    @Column(name = "certificate_image_url", columnDefinition = "TEXT")
    private String certificateImageUrl;

    @Column(name = "pedigree_url", columnDefinition = "TEXT")
    private String pedigreeUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
