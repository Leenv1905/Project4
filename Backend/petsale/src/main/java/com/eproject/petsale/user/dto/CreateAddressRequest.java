package com.eproject.petsale.user.dto;

import lombok.Data;

@Data
public class CreateAddressRequest {
    private String receiverName;
    private String phone;
    private String address;
    private Boolean isDefault;
}