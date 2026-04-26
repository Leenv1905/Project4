package com.eproject.petsale.auth.security;

import com.eproject.petsale.common.exception.AuthException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Bỏ qua validation cho các auth endpoint (login, refresh, register, ...)
        // để refresh token hoạt động khi access token đã hết hạn
        String path = request.getRequestURI();
        if (path.startsWith("/gupet/v1/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            String token = null;

            if (request.getCookies() != null) {
                for (var cookie : request.getCookies()) {
                    if ("access_token".equals(cookie.getName())) {
                        token = cookie.getValue();
                    }
                }
            }

            if (token != null) {

                jwtUtil.validateToken(token);

                String email = jwtUtil.extractEmail(token);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                new ArrayList<>()
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } catch (AuthException e) {

            SecurityContextHolder.clearContext();

            authenticationEntryPoint.commence(request, response, null);

        }
    }
}