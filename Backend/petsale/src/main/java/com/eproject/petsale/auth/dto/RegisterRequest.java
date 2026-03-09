package com.eproject.petsale.auth.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class RegisterRequest {

    private String email;

    private String password;

    private String name;

    private String phone;

    private String address;

    private PersonalizationDTO personalization;

    private MultipartFile avatar;

}