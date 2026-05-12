package com.eproject.petsale.notifiEmail.service;

import com.eproject.petsale.notifiEmail.dto.EmailNotificationRequest;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async // Gửi bất đồng bộ để API phản hồi ngay lập tức
    @Override
    public void sendNotificationEmail(EmailNotificationRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            // 1. Chuẩn bị dữ liệu cho template Thymeleaf
            Context context = new Context();
            context.setVariable("username", request.getUsername());
            context.setVariable("content", request.getMessage());
            // 2. Tạo nội dung HTML từ file template
            String html = templateEngine.process("email-template", context);

            // 3. Cấu hình thông tin gửi
            helper.setTo(request.getToEmail());
            helper.setText(html, true);
            helper.setSubject("Notification from GuPet System");
            helper.setFrom("noreply@gupet.com");

            mailSender.send(message);

        } catch (Exception e) {
            // Xử lý lỗi (log lại lỗi)
            System.err.println("Lỗi gửi mail: " + e.getMessage());
        }
    }
}