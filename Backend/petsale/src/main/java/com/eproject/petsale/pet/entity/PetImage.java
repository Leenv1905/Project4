package com.eproject.petsale.pet.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table (name = "pet_images")
public class PetImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "image_url",nullable = false,columnDefinition = "TEXT")
    private String imageUrl;
    @Column(name = "object_key",length = 500)
    private String objectKey;
    @Column (name = "is_primary",nullable = false)
    private boolean isPrimary;
    @Column (name = "display_order" )
    private int displayOrder;
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;


}

