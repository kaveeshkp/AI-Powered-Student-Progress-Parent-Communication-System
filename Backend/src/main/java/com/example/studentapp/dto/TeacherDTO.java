package com.example.studentapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.time.Instant;

/**
 * DTO for Teacher response containing teacher information.
 */
public record TeacherDTO(
    @JsonProperty("id") Long id,
    @JsonProperty("department") String department,
    @JsonProperty("specialization") String specialization,
    @JsonProperty("fullName") String fullName,
    @JsonProperty("email") String email,
    @JsonProperty("createdAt") Instant createdAt,
    @JsonProperty("updatedAt") Instant updatedAt
) {
}
