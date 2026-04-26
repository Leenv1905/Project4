package com.eproject.petsale.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserAddressResponse {
    private Long id;
    private String receiverName;
    private String phone;
    private String address;
    private Boolean isDefault;
    private LocalDateTime createdAt;
}