package com.eproject.registry.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;
        String refreshToken = null;

        // ===== LẤY TOKEN =====
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("access_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
                if ("refresh_token".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        // ===== VALIDATE ACCESS TOKEN =====
        if (token != null && jwtUtil.validateToken(token)) {

            var claims = jwtUtil.getClaims(token);
            setAuthentication(claims);

            filterChain.doFilter(request, response);
            return;
        }

        // ===== REFRESH TOKEN =====
        if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {

            var claims = jwtUtil.getClaims(refreshToken);

            String newAccessToken = jwtUtil.generateAccessToken(
                    claims.getSubject(),
                    claims.get("role", String.class)
            );

            jakarta.servlet.http.Cookie newCookie =
                    new jakarta.servlet.http.Cookie("access_token", newAccessToken);
            newCookie.setHttpOnly(true);
            newCookie.setPath("/");

            response.addCookie(newCookie);

            setAuthentication(claims);

            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
    private void setAuthentication(io.jsonwebtoken.Claims claims) {

        String rolesStr = claims.get("role", String.class);

        List<SimpleGrantedAuthority> authorities =
                Arrays.stream(rolesStr.split(","))
                        .map(String::trim)
                        .map(SimpleGrantedAuthority::new)
                        .toList();

        var auth = new UsernamePasswordAuthenticationToken(
                claims.getSubject(),
                null,
                authorities
        );

        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}