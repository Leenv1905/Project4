package com.eproject.petsale.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seller_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerProfile {

    @Id
    private Long userId;

    @OneToOne
    @MapsId // Dùng user_id làm khóa chính đồng thời là khóa ngoại trỏ tới User
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "seller_type")
    private String sellerType;

    private String bio;
    @Column(name = "tax_code")
    private String taxCode;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}