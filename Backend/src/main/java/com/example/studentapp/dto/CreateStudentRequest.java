package com.example.studentapp.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * Request DTO for creating a new Student.
 */
public record CreateStudentRequest(
    @NotBlank(message = "Admission number is required")
    @Size(min = 5, max = 20, message = "Admission number must be between 5 and 20 characters")
    String admissionNumber,

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    String fullName,

    @NotNull(message = "Date of birth is required")
    @PastOrPresent(message = "Date of birth cannot be in the future")
    LocalDate dateOfBirth,

    @NotBlank(message = "Grade level is required")
    String gradeLevel,

    @NotBlank(message = "Section is required")
    String section
) {
}
