package com.eproject.petsale.common.util;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    // lấy Authentication hiện tại
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    // lấy token (JWT – JSON Web Token)
    public static String getCurrentToken() {
        Authentication auth = getAuthentication();

        if (auth == null) {
            return null;
        }

        Object credentials = auth.getCredentials();

        if (credentials == null) {
            return null;
        }

        return credentials.toString();
    }

    // check role OPERATOR
    public static boolean isOperator() {
        Authentication auth = getAuthentication();

        if (auth == null) {
            return false;
        }

        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_OPERATOR"));
    }
}