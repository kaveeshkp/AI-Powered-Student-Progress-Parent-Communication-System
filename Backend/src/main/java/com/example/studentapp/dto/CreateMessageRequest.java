package com.example.studentapp.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for sending a Message.
 */
public record CreateMessageRequest(
    @NotNull(message = "Receiver ID is required")
    Long receiverId,

    @NotBlank(message = "Message content is required")
    @Size(min = 1, max = 5000, message = "Message must be between 1 and 5000 characters")
    String content
) {
}
