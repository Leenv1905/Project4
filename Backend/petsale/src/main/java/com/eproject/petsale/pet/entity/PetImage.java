package com.eproject.petsale.pet.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "pet_images")
public class PetImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl; // Đây sẽ là ảnh hiển thị cuối cùng (ảnh AI hoặc ảnh thường)

    @Column(name = "original_image_url", columnDefinition = "TEXT")
    private String originalImageUrl; // Lưu lại ảnh gốc người dùng đã tải lên

    @Column(name = "object_key", length = 500)
    private String objectKey;

    @Column(name = "is_primary", nullable = false)
    private boolean isPrimary;

    @Column(name = "display_order")
    private int displayOrder;

    @Column(name = "is_ai_processed", nullable = false)
    private boolean isAiProcessed = false;

    @Column(name = "ai_prompt", columnDefinition = "TEXT")
    private String aiPrompt; // Lưu lại mô tả/style đã dùng để render

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}