package com.example.studentapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for Grade Analytics response.
 */
public record GradeAnalyticsDTO(
    @JsonProperty("studentId") Long studentId,
    @JsonProperty("gpa") Double gpa,
    @JsonProperty("averageScore") Double averageScore
) {
}
