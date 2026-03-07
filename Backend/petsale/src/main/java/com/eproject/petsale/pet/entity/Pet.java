package com.eproject.petsale.pet.entity;

import com.eproject.petsale.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
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

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;


    @OneToOne(mappedBy = "pet", cascade = CascadeType.ALL)
    private PetRequirement requirements;


    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private List<PetImage> images;
}
