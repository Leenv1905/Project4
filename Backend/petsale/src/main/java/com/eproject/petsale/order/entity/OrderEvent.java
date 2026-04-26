package com.eproject.petsale.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "order_events")
public class OrderEvent {

    @Id
    private String id;

    private Long orderId;

    private String eventType;
    private String fromStatus;
    private String toStatus;

    private Long actorId;
    private String actorRole;

    @Column(columnDefinition = "json")
    private String payload;

    private LocalDateTime createdAt;
}