package com.eproject.petsale.order.repository;

import com.eproject.petsale.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);
    List<Order> findByOrderItems_Pet_Id(Long petId);
    List<Order> findByStatus(String status);
    List<Order> findByFulfillmentStatus(String fulfillmentStatus);
    List<Order> findByStatusAndFulfillmentStatus(String status, String fulfillmentStatus);
    List<Order> findByShopIdAndFulfillmentStatus(Long shopId, String fulfillmentStatus);
}
