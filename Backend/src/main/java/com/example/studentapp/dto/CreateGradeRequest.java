package com.example.studentapp.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for creating a new Grade.
 */
public record CreateGradeRequest(
    @NotNull(message = "Student ID is required")
    Long studentId,

    @NotBlank(message = "Subject is required")
    @Size(min = 2, max = 50, message = "Subject must be between 2 and 50 characters")
    String subject,

    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score cannot be less than 0")
    @Max(value = 100, message = "Score cannot be greater than 100")
    Integer score,

    @NotBlank(message = "Term is required")
    @Size(min = 2, max = 50, message = "Term must be between 2 and 50 characters")
    String term,

    String teacherRemark
) {
}
