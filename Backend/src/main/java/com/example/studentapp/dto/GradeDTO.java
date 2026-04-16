package com.example.studentapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

/**
 * DTO for Grade response containing grade information.
 */
public record GradeDTO(
    @JsonProperty("id") Long id,
    @JsonProperty("studentId") Long studentId,
    @JsonProperty("subject") String subject,
    @JsonProperty("score") BigDecimal score,
    @JsonProperty("term") String term,
    @JsonProperty("teacherRemark") String teacherRemark,
    @JsonProperty("recordedAt") LocalDateTime recordedAt,
    @JsonProperty("createdAt") Instant createdAt,
    @JsonProperty("updatedAt") Instant updatedAt
) {
}
