package com.example.studentapp.controller;

import com.example.studentapp.dto.*;
import com.example.studentapp.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

/**
 * REST Controller for Announcement management endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
@Tag(name = "Announcements", description = "Announcement management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    /**
     * Get all announcements with pagination.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get announcements", description = "Retrieve paginated list of announcements")
    public ResponseEntity<PageResponse<AnnouncementDTO>> getAllAnnouncements(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching announcements: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<AnnouncementDTO> response = announcementService.getAllAnnouncements(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get announcement by ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get announcement", description = "Retrieve announcement details")
    public ResponseEntity<AnnouncementDTO> getAnnouncementById(@PathVariable Long id) {
        log.debug("Fetching announcement: id={}", id);
        AnnouncementDTO announcement = announcementService.getAnnouncementById(id);
        return ResponseEntity.ok(announcement);
    }

    /**
     * Create a new announcement.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Create announcement", description = "Create new announcement")
    public ResponseEntity<AnnouncementDTO> createAnnouncement(
            @Valid @RequestBody CreateAnnouncementRequest request,
            Authentication authentication) {

        log.info("Creating announcement: title={}", request.title());
        Long creatorId = Long.parseLong(authentication.getName());
        AnnouncementDTO announcement = announcementService.createAnnouncement(creatorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(announcement);
    }

    /**
     * Update an existing announcement.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Update announcement", description = "Update announcement information")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAnnouncementRequest request) {

        log.info("Updating announcement: id={}", id);
        AnnouncementDTO announcement = announcementService.updateAnnouncement(id, request);
        return ResponseEntity.ok(announcement);
    }

    /**
     * Delete an announcement.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Delete announcement", description = "Delete an announcement")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        log.info("Deleting announcement: id={}", id);
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get announcements by date range.
     */
    @GetMapping("/by-date")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get announcements by date", description = "Retrieve announcements for date range")
    public ResponseEntity<PageResponse<AnnouncementDTO>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching announcements by date: from={}, to={}", from, to);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<AnnouncementDTO> response = announcementService.getByDateRange(from, to, pageable);
        return ResponseEntity.ok(response);
    }
}
