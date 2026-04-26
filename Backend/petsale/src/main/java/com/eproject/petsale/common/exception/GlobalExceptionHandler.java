package com.eproject.petsale.common.exception;

import com.eproject.petsale.common.exception.AuthException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiErrorResponse handleServerError(
            Exception ex,
            HttpServletRequest request
    ) {

        log.error("Internal error: {}", ex.getMessage(), ex);

        return new ApiErrorResponse(
                500,
                "Internal Server Error",
                ex.getMessage() != null ? ex.getMessage() : "Unexpected error occurred",
                request.getRequestURI()
        );
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleNotFound(
            Exception ex,
            HttpServletRequest request
    ) {

        return new ApiErrorResponse(
                404,
                "Not Found",
                "Resource not found",
                request.getRequestURI()
        );
    }

    @ExceptionHandler(ExternalApiException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public ApiErrorResponse handleExternalApiError(
            ExternalApiException ex,
            HttpServletRequest request
    ) {
        log.warn("External API error: {}", ex.getMessage());
        return new ApiErrorResponse(
                503,
                "Service Unavailable",
                ex.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleBadRequest(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {

        return new ApiErrorResponse(
                400,
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(AuthException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiErrorResponse handleAuthException(
            AuthException ex,
            HttpServletRequest request
    ) {

        return new ApiErrorResponse(
                401,
                "Unauthorized",
                ex.getMessage(),
                request.getRequestURI()
        );
    }
}