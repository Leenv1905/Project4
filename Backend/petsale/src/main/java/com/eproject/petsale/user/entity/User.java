package com.eproject.petsale.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

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

    @ManyToMany(fetch = FetchType.EAGER) // EAGER giúp lấy luôn danh sách Role khi tìm User
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

}