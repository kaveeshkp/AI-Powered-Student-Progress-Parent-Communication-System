package com.example.studentapp.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Standardized error response for all API error responses.
 */
public record ErrorResponse(
    @JsonProperty("timestamp") LocalDateTime timestamp,
    @JsonProperty("status") int status,
    @JsonProperty("error") String error,
    @JsonProperty("message") String message,
    @JsonProperty("path") String path,
    @JsonProperty("details") String details
) {
    /**
     * Create an ErrorResponse.
     *
     * @param status HTTP status code
     * @param error error type/name
     * @param message error message
     * @param path request path
     * @param details additional error details
     * @return ErrorResponse instance
     */
    public static ErrorResponse of(int status, String error, String message, String path, String details) {
        return new ErrorResponse(LocalDateTime.now(), status, error, message, path, details);
    }

    /**
     * Create an ErrorResponse without details.
     */
    public static ErrorResponse of(int status, String error, String message, String path) {
        return of(status, error, message, path, null);
    }
}
