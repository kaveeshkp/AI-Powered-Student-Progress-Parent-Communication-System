package com.example.studentapp.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * Request DTO for updating an existing Student.
 */
public record UpdateStudentRequest(
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    String fullName,

    LocalDate dateOfBirth,

    String gradeLevel,

    String section
) {
}
