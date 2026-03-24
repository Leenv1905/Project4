package com.eproject.petsale.auth.config;

import com.eproject.petsale.auth.security.CustomAccessDeniedHandler;
import com.eproject.petsale.auth.security.CustomAuthenticationEntryPoint;
import com.eproject.petsale.auth.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/gupet/v1/auth/**").permitAll()
                        .requestMatchers("/gupet/v1/api/users/**").authenticated()
                        .requestMatchers("/gupet/api/v1/pets/public").permitAll()
                        .requestMatchers("/gupet/api/v1/pets/**").authenticated()
                        .requestMatchers("/gupet/api/v1/cart/**").authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter,// gọi phương thức này để xác thực req có có token
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                        .accessDeniedHandler(new CustomAccessDeniedHandler())
                );

        return http.build();
    }
}