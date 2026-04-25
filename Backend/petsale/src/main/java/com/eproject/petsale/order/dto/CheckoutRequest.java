package com.eproject.petsale.order.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String address;
    private String phone;
    private String customerName;
    private String note;
    private String paymentMethod;
}
