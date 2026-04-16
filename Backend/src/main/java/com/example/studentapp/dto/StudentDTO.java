package com.example.studentapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO for Student response containing all student information.
 */
public record StudentDTO(
    @JsonProperty("id") Long id,
    @JsonProperty("admissionNumber") String admissionNumber,
    @JsonProperty("fullName") String fullName,
    @JsonProperty("dateOfBirth") LocalDate dateOfBirth,
    @JsonProperty("gradeLevel") String gradeLevel,
    @JsonProperty("section") String section,
    @JsonProperty("createdAt") Instant createdAt,
    @JsonProperty("updatedAt") Instant updatedAt
) {
}
