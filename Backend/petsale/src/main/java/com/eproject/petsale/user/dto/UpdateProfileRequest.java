package com.eproject.petsale.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    private String name;
    private String phone;
    private String address;
    private String avatarUrl;



}