package com.example.studentapp.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for updating an existing Grade.
 */
public record UpdateGradeRequest(
    @Min(value = 0, message = "Score cannot be less than 0")
    @Max(value = 100, message = "Score cannot be greater than 100")
    Integer score,

    String subject,

    String term,

    String teacherRemark
) {
}
