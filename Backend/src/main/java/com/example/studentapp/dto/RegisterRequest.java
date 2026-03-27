package com.example.studentapp.dto;

import com.example.studentapp.enums.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        @NotNull RoleType role
) {
}
