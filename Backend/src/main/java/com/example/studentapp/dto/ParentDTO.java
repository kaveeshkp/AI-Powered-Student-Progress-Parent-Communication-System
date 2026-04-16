package com.example.studentapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

/**
 * DTO for Parent response containing parent information.
 */
public record ParentDTO(
    @JsonProperty("id") Long id,
    @JsonProperty("fullName") String fullName,
    @JsonProperty("email") String email,
    @JsonProperty("phoneNumber") String phoneNumber,
    @JsonProperty("address") String address,
    @JsonProperty("createdAt") Instant createdAt,
    @JsonProperty("updatedAt") Instant updatedAt
) {
}
