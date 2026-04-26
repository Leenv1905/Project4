package com.eproject.petsale.order.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private Long addressId;
    private String note;
    private String paymentMethod;
}
