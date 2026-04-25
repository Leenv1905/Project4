package com.eproject.petsale.admin.service;

import com.eproject.petsale.admin.dto.DashboardStatsResponse;
import com.eproject.petsale.admin.dto.RevenueData;
import com.eproject.petsale.order.entity.Order;
import com.eproject.petsale.order.repository.OrderRepository;
import com.eproject.petsale.pet.repository.PetRepository;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;

    public DashboardStatsResponse getStats() {
        List<Order> orders = orderRepository.findAll();
        
        BigDecimal totalRevenue = orders.stream()
                .filter(o -> "COMPLETED".equalsIgnoreCase(o.getPaymentStatus()) || "PAID".equalsIgnoreCase(o.getPaymentStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardStatsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalUsers(userRepository.count())
                .totalPets(petRepository.count())
                .totalOrders((long) orders.size())
                .build();
    }

    public List<RevenueData> getRevenueChartData() {
        List<Order> orders = orderRepository.findAll();
        
        // Group by month (last 6 months)
        Map<String, BigDecimal> revenueByMonth = orders.stream()
                .filter(o -> "COMPLETED".equalsIgnoreCase(o.getPaymentStatus()) || "PAID".equalsIgnoreCase(o.getPaymentStatus()))
                .filter(o -> o.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + o.getCreatedAt().getYear(),
                        Collectors.reducing(BigDecimal.ZERO, Order::getTotalAmount, BigDecimal::add)
                ));

        // Sort by month (simplified for now)
        return revenueByMonth.entrySet().stream()
                .map(e -> new RevenueData(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }
}
