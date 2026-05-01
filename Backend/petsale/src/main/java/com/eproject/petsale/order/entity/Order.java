package com.eproject.petsale.order.entity;

import com.eproject.petsale.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipping_address", nullable = false)
    private String address;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "shipping_receiver", nullable = false)
    private String customerName;

    @Column(name = "fulfillment_status")
    private String fulfillmentStatus;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "payment_status")
    private String paymentStatus;
    
    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "shipping_phone", nullable = false)
    private String phone;

    private String status;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "order_code", nullable = false, unique = true)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User shop;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;
}
