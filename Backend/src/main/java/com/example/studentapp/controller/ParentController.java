package com.example.studentapp.controller;

import com.example.studentapp.dto.*;
import com.example.studentapp.service.ParentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Parent management endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/parents")
@RequiredArgsConstructor
@Tag(name = "Parents", description = "Parent management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ParentController {

    private final ParentService parentService;

    /**
     * Get all parents with pagination.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all parents", description = "Retrieve paginated list of parents")
    public ResponseEntity<PageResponse<ParentDTO>> getAllParents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching parents: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<ParentDTO> response = parentService.getAllParents(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get parent by ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARENT')")
    @Operation(summary = "Get parent by ID", description = "Retrieve parent details")
    public ResponseEntity<ParentDTO> getParentById(@PathVariable Long id) {
        log.debug("Fetching parent: id={}", id);
        ParentDTO parent = parentService.getParentById(id);
        return ResponseEntity.ok(parent);
    }

    /**
     * Create a new parent.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create parent", description = "Create a new parent")
    public ResponseEntity<ParentDTO> createParent(@Valid @RequestBody CreateParentRequest request) {
        log.info("Creating parent: email={}", request.email());
        ParentDTO parent = parentService.createParent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(parent);
    }

    /**
     * Update an existing parent.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update parent", description = "Update parent information")
    public ResponseEntity<ParentDTO> updateParent(
            @PathVariable Long id,
            @Valid @RequestBody ParentDTO request) {
        log.info("Updating parent: id={}", id);
        ParentDTO parent = parentService.updateParent(id, request);
        return ResponseEntity.ok(parent);
    }

    /**
     * Delete a parent.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete parent", description = "Delete a parent")
    public ResponseEntity<Void> deleteParent(@PathVariable Long id) {
        log.info("Deleting parent: id={}", id);
        parentService.deleteParent(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get parent's children (students).
     */
    @GetMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARENT')")
    @Operation(summary = "Get parent's students", description = "Retrieve all students assigned to parent")
    public ResponseEntity<PageResponse<StudentDTO>> getParentStudents(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching students for parent: id={}", id);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<StudentDTO> response = parentService.getParentChildren(id, pageable);
        return ResponseEntity.ok(response);
    }
}
