package com.eproject.petsale.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    private String phone;

    private String address;

    @Column(name = "avatar_path")
    private String avatarPath;

    @Column(name = "refresh_token")
    private String refreshToken;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

}