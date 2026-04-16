package com.example.studentapp.controller;

import com.example.studentapp.dto.*;
import com.example.studentapp.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Message management endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@Tag(name = "Messages", description = "Message endpoints")
@SecurityRequirement(name = "bearerAuth")
public class MessageController {

    private final MessageService messageService;

    /**
     * Get user's inbox messages.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get messages", description = "Retrieve inbox messages for authenticated user")
    public ResponseEntity<PageResponse<MessageDTO>> getMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        log.debug("Fetching messages for user");
        Long userId = extractUserId(authentication);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<MessageDTO> response = messageService.getMessages(userId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get message by ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get message", description = "Retrieve message details")
    public ResponseEntity<MessageDTO> getMessageById(@PathVariable Long id) {
        log.debug("Fetching message: id={}", id);
        MessageDTO message = messageService.getMessageById(id);
        return ResponseEntity.ok(message);
    }

    /**
     * Send a new message.
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Send message", description = "Send message to another user")
    public ResponseEntity<MessageDTO> sendMessage(
            @Valid @RequestBody CreateMessageRequest request,
            Authentication authentication) {

        log.info("Sending message to user: receiverId={}", request.receiverId());
        Long senderId = extractUserId(authentication);
        MessageDTO message = messageService.sendMessage(senderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    /**
     * Mark message as read.
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark as read", description = "Mark message as read")
    public ResponseEntity<MessageDTO> markAsRead(@PathVariable Long id) {
        log.info("Marking message as read: id={}", id);
        MessageDTO message = messageService.markAsRead(id);
        return ResponseEntity.ok(message);
    }

    /**
     * Delete message.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete message", description = "Delete a message")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        log.info("Deleting message: id={}", id);
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get conversation thread with another user.
     */
    @GetMapping("/conversation/{otherUserId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get conversation", description = "Retrieve conversation thread with user")
    public ResponseEntity<PageResponse<MessageDTO>> getConversation(
            @PathVariable Long otherUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        log.debug("Fetching conversation with user: otherUserId={}", otherUserId);
        Long userId = extractUserId(authentication);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<MessageDTO> response = messageService.getConversation(userId, otherUserId, pageable);
        return ResponseEntity.ok(response);
    }

    private Long extractUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}
