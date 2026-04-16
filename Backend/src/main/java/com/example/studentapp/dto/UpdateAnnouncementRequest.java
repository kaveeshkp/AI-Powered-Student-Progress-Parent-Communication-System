package com.example.studentapp.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for updating an Announcement.
 */
public record UpdateAnnouncementRequest(
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    String title,

    @Size(min = 10, max = 10000, message = "Content must be between 10 and 10000 characters")
    String content
) {
}
