package com.example.studentapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.time.LocalDateTime;

/**
 * DTO for Message response containing message information.
 */
public record MessageDTO(
    @JsonProperty("id") Long id,
    @JsonProperty("senderId") Long senderId,
    @JsonProperty("senderName") String senderName,
    @JsonProperty("receiverId") Long receiverId,
    @JsonProperty("receiverName") String receiverName,
    @JsonProperty("content") String content,
    @JsonProperty("isRead") Boolean isRead,
    @JsonProperty("sentAt") LocalDateTime sentAt,
    @JsonProperty("createdAt") Instant createdAt,
    @JsonProperty("updatedAt") Instant updatedAt
) {
}
