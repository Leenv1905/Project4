package com.eproject.petsale.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterSellerRequest {
    private String displayName;
    private String sellerType; // INDIVIDUAL, SHOP, FARM
    private String bio;
    private String taxCode;
    // Getters và Setters
}