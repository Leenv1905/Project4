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
@Table(name = "verification_tasks")
public class VerificationTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id", nullable = false)
    private User operator;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(length = 20)
    private String status; // PENDING, SUBMITTED, APPROVED, REJECTED

    @Column(name = "scanned_chip_code")
    private String scannedChipCode;

    @Column(name = "scanned_chip_image_url")
    private String scannedChipImageUrl;

    @Column(name = "location_gps")
    private String locationGps;

    @Column(name = "health_note", columnDefinition = "TEXT")
    private String healthNote;

    @Column(name = "admin_feedback", columnDefinition = "TEXT")
    private String adminFeedback;
}
