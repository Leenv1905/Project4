package com.eproject.petsale.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String email;

    private String password;

    private String name;

    private String phone;

    private String address;

    private PersonalizationDTO personalization;

}