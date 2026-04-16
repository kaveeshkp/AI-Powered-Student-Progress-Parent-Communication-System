package com.example.studentapp.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for creating a new Parent.
 */
public record CreateParentRequest(
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    String fullName,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    String email,

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be between 10 and 15 digits")
    String phoneNumber,

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 250, message = "Address must be between 5 and 250 characters")
    String address
) {
}
