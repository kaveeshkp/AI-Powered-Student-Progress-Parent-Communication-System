package com.example.studentapp.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for creating a new Teacher.
 */
public record CreateTeacherRequest(
    @NotBlank(message = "Department is required")
    @Size(min = 2, max = 50, message = "Department must be between 2 and 50 characters")
    String department,

    @NotBlank(message = "Specialization is required")
    @Size(min = 2, max = 100, message = "Specialization must be between 2 and 100 characters")
    String specialization,

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    String fullName,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    String email
) {
}
