package com.eproject.registry.config;

// Nếu bạn không copy class AuthException sang, hãy dùng RuntimeException
// hoặc tạo một class Exception đơn giản trong package của Service B
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secret;

    private Key key;

    @PostConstruct
    public void init() {
        // Đảm bảo byte array lấy từ secret đủ độ dài cho HMAC-SHA
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // 1. Hàm trích xuất Role (QUAN TRỌNG NHẤT cho Service B)
    public String extractRole(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.get("role", String.class);
        } catch (Exception e) {
            log.error("Không thể lấy role từ token: {}", e.getMessage());
            return null;
        }
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public void validateToken(String token) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("Token is null or empty");
        }
        try {
            getClaims(token);
        } catch (Exception e) {
            log.warn("JWT validation failed: {}", e.getMessage());
            throw new RuntimeException("Invalid or expired token");
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Giữ lại hàm này để đồng bộ với Service A nếu cần tạo token test tại chỗ
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 300000)) // 1 giờ
                .signWith(key)
                .compact();
    }
}