package com.eproject.petsale.user.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerProfileResponse {
    private Long userId;
    private String shopName;     // Ánh xạ từ display_name trong DB
    private String sellerType;   // INDIVIDUAL, SHOP, FARM...
    private String bio;
    private String taxCode;
    private String address;
    private LocalDateTime createdAt;
}