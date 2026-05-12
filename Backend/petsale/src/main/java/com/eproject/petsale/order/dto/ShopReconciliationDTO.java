package com.eproject.petsale.order.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ShopReconciliationDTO {

    private BigDecimal totalListedAmount;
    private long totalPets;
    private long soldCount;
    private long unsoldCount;

    private BigDecimal grossRevenue;
    private BigDecimal platformFee;
    private BigDecimal netRevenue;

    private List<DeliveredOrderItem> deliveredOrders;

    @Data
    @Builder
    public static class DeliveredOrderItem {
        private Long orderId;
        private String orderCode;
        private String customerName;
        private LocalDateTime deliveredAt;
        private BigDecimal orderAmount;
        private BigDecimal fee;
        private BigDecimal netAmount;
    }
}