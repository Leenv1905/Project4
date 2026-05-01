package com.eproject.petsale.order.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private Long addressId;
    private String customerName;
    private String phone;
    private String address;
    private String note;
    private String paymentMethod;
}
