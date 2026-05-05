package com.eproject.petsale.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @Column
    private String description;

    // THÊM PHẦN NÀY ĐỂ KẾT NỐI HAI CHIỀU
    @ManyToMany(mappedBy = "roles")
    @JsonIgnore // Ngăn chặn vòng lặp vô tận khi convert sang JSON
    private Set<User> users = new HashSet<>();
}