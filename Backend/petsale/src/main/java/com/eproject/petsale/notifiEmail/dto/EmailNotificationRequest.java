package com.eproject.petsale.notifiEmail.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailNotificationRequest {
    private String toEmail;
    private String username;
    private String message;

    // Getters and Setters
}