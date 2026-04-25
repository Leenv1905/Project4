package com.eproject.petsale.payment.controller;

import com.eproject.petsale.payment.dto.PaymentResponse;
import com.eproject.petsale.payment.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/vnpay/create-url")
    public ResponseEntity<PaymentResponse> createPaymentUrl(
            @RequestParam Long orderId,
            HttpServletRequest request) throws UnsupportedEncodingException {
        String clientIp = getClientIp(request);
        PaymentResponse response = paymentService.createPaymentUrl(orderId, clientIp);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay/return")
    public ResponseEntity<String> vnpayReturn(@RequestParam Map<String, String> allParams) {
        paymentService.updateOrderStatusFromVNPay(allParams);
        // This endpoint will be hit by the frontend or VNPay callback
        // For simplicity, we just return OK, but usually you redirect the user.
        return ResponseEntity.ok("Payment processed successfully");
    }

    private String getClientIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
            if (ipAddress.equals("0:0:0:0:0:0:0:1")) {
                ipAddress = "127.0.0.1";
            }
        }
        return ipAddress;
    }
}
