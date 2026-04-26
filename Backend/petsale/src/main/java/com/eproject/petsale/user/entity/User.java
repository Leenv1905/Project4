package com.eproject.petsale.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    private String name;

    private Boolean enabled = true;

    private String phone;

    private String address;

    @Column(name = "avatar_path")
    private String avatarPath;

    @Column(name = "refresh_token")
    private String refreshToken;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    // --- BỔ SUNG QUAN HỆ VỚI SELLER PROFILE ---
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private SellerProfile sellerProfile;

    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL)
    private List<com.eproject.petsale.order.entity.Order> purchasedOrders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.eproject.petsale.auth.entity.SsoAccount> ssoAccounts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.eproject.petsale.auth.entity.OtpVerification> otpVerifications;
}