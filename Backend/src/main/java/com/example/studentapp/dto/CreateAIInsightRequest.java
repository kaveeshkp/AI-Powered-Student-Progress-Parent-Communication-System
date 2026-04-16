package com.example.studentapp.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for creating an AI Insight.
 */
public record CreateAIInsightRequest(
    @NotNull(message = "Student ID is required")
    Long studentId
) {
}
