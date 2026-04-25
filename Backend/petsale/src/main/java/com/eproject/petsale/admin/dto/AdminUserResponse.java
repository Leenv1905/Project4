package com.eproject.petsale.admin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUserResponse {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String phone;
    private String address;
    private String avatarUrl;
    private Boolean enabled;
}
