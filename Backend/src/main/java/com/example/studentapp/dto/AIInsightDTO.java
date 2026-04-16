package com.example.studentapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.time.LocalDateTime;

/**
 * DTO for AI Insight response containing insight information.
 */
public record AIInsightDTO(
    @JsonProperty("id") Long id,
    @JsonProperty("studentId") Long studentId,
    @JsonProperty("strengths") String strengths,
    @JsonProperty("weaknesses") String weaknesses,
    @JsonProperty("suggestions") String suggestions,
    @JsonProperty("generatedAt") LocalDateTime generatedAt,
    @JsonProperty("createdAt") Instant createdAt,
    @JsonProperty("updatedAt") Instant updatedAt
) {
}
