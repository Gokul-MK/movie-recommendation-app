package com.movieapp.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

/**
 * Centralized exception handler.
 * Converts RuntimeExceptions to clean JSON error responses instead of
 * the default Spring Boot white-label error page.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles explicit ResponseStatusException (409 Conflict, 404 Not Found, etc.)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatus(ResponseStatusException ex) {
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(Map.of("error", ex.getReason() != null ? ex.getReason() : ex.getMessage()));
    }

    // Handles RuntimeException from MovieService / AIRecommendationService
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        String message = ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred";
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", message));
    }

    // Catch-all for any other unexpected exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneral(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error: " + ex.getMessage()));
    }
}
