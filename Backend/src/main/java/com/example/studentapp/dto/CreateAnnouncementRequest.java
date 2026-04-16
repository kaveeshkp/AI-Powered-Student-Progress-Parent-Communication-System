package com.example.studentapp.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for creating an Announcement.
 */
public record CreateAnnouncementRequest(
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    String title,

    @NotBlank(message = "Content is required")
    @Size(min = 10, max = 10000, message = "Content must be between 10 and 10000 characters")
    String content
) {
}
