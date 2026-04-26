package com.eproject.petsale.pet.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "user_ai_usage", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "usage_date"})
})
public class UserAiUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "usage_date", nullable = false)
    private LocalDate usageDate;

    @Column(name = "usage_count", nullable = false)
    private int usageCount;

    public UserAiUsage() {}

    public UserAiUsage(Long userId, LocalDate usageDate, int usageCount) {
        this.userId = userId;
        this.usageDate = usageDate;
        this.usageCount = usageCount;
    }
}