package com.eproject.petsale.pet.entity;

import com.eproject.petsale.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pet_code", unique = true)
    private String petCode;

    private String name;
    private String species;
    private String breed;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "trust_score")
    private Integer trustScore;

    @Column(name = "is_health_verified")
    private Boolean isHealthVerified;

    @Column(name = "is_pedigree_verified")
    private Boolean isPedigreeVerified;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private PetRequirement requirements;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PetImage> images;
}
