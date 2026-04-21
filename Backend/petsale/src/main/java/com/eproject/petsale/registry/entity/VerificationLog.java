package com.eproject.petsale.registry.entity;

import com.eproject.petsale.pet.entity.Pet;
import com.eproject.petsale.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "verification_logs")
public class VerificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verifier_id", nullable = false)
    private User verifier;

    @Column(name = "check_date", insertable = false, updatable = false)
    private LocalDateTime checkDate;

    @Column(name = "scanned_chip_image_url", nullable = false, columnDefinition = "TEXT")
    private String scannedChipImageUrl;

    @Column(name = "location_verified")
    private String locationVerified;

    @Column(name = "health_snapshot")
    private String healthSnapshot;

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @Column(columnDefinition = "enum('PENDING','VERIFIED','REJECTED') default 'VERIFIED'")
    private String status;
}
