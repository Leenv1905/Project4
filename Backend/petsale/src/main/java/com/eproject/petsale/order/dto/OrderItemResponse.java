package com.eproject.petsale.order.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private Long id;
    private Long petId;
    private String petName;
    private String petImage;
    private BigDecimal price;
    private int quantity;
}
