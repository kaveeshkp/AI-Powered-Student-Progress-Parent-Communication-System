package com.example.studentapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

/**
 * DTO for Announcement response containing announcement information.
 */
public record AnnouncementDTO(
    @JsonProperty("id") Long id,
    @JsonProperty("title") String title,
    @JsonProperty("content") String content,
    @JsonProperty("createdByUserId") Long createdByUserId,
    @JsonProperty("createdByName") String createdByName,
    @JsonProperty("createdAt") Instant createdAt,
    @JsonProperty("updatedAt") Instant updatedAt
) {
}
