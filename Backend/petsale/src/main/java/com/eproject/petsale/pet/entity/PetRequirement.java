package com.eproject.petsale.pet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "pet_requirements")
public class PetRequirement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "min_daily_time")
    private Integer minDailyTime;

    @Column(name = "min_living_space")
    private Integer minLivingSpace;
    @Column(name = "min_activity_time")
    private Integer minActivityTime;
    @Column(name = "min_monthly_budget")
    private Integer minMonthlyBudget;
    @Column(name = "min_experience_level")
    private Integer minExperienceLevel;
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}