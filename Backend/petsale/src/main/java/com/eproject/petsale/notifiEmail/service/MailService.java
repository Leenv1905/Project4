package com.eproject.petsale.notifiEmail.service;

import com.eproject.petsale.notifiEmail.dto.EmailNotificationRequest;

public interface MailService {
    void sendNotificationEmail(EmailNotificationRequest request);
}