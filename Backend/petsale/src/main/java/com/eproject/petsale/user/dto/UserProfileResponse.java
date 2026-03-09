package com.eproject.petsale.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {

    private Long id;
    private String email;
    private String name;
    private String phone;
    private String address;
    private String avatarUrl;
}