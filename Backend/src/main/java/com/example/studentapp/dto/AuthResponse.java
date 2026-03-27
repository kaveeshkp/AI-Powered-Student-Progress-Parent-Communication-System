package com.example.studentapp.dto;

import com.example.studentapp.enums.RoleType;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String fullName,
        String email,
        RoleType role
) {
}
