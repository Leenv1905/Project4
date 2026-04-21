package com.eproject.petsale.order.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String customerName;
    private String address;
    private String phone;
    private String note;
    private String status;
    private String paymentStatus;
    private String fulfillmentStatus;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private Long buyerId;
    private Long shopId;
    private String shopName;
    private List<OrderItemResponse> items;
}
