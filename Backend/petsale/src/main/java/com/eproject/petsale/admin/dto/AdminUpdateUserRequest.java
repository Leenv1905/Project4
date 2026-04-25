package com.eproject.petsale.admin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUpdateUserRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String phone;
    private String address;
    private String avatarUrl;
}
