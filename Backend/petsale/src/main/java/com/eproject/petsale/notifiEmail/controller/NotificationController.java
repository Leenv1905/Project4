package com.eproject.petsale.notifiEmail.controller;

import com.eproject.petsale.notifiEmail.dto.EmailNotificationRequest;
import com.eproject.petsale.notifiEmail.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gupet/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final MailService mailService;

    @PostMapping("/send")
    public ResponseEntity<String> triggerNotification(@RequestBody EmailNotificationRequest request) {
        mailService.sendNotificationEmail(request);
        return ResponseEntity.ok("Yêu cầu gửi mail đã được ghi nhận!");
    }
}
