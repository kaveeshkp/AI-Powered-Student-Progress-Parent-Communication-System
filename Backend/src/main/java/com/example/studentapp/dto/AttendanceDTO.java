package com.example.studentapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.example.studentapp.enums.AttendanceStatus;
import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO for Attendance response containing attendance information.
 */
public record AttendanceDTO(
    @JsonProperty("id") Long id,
    @JsonProperty("studentId") Long studentId,
    @JsonProperty("date") LocalDate date,
    @JsonProperty("status") AttendanceStatus status,
    @JsonProperty("remark") String remark,
    @JsonProperty("createdAt") Instant createdAt,
    @JsonProperty("updatedAt") Instant updatedAt
) {
}
