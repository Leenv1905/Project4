package com.eproject.petsale.personalization.entity;

import com.eproject.petsale.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "buyer_profiles")
@Getter
@Setter
public class BuyerProfile {

    @Id
    @Column(name = "user_id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "daily_time")
    private Integer dailyTime;

    @Column(name = "living_space")
    private Integer livingSpace;

    @Column(name = "activity_time")
    private Integer activityTime;

    @Column(name = "monthly_budget")
    private Integer monthlyBudget;

    @Column(name = "experience_level")
    private Integer experienceLevel;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}