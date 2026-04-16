package com.example.studentapp.controller;

import com.example.studentapp.dto.*;
import com.example.studentapp.service.GradeService;
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
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Grade management endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/grades")
@RequiredArgsConstructor
@Tag(name = "Grades", description = "Grade management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class GradeController {

    private final GradeService gradeService;

    /**
     * Get all grades with pagination and filtering.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get all grades", description = "Retrieve paginated list of grades")
    public ResponseEntity<PageResponse<GradeDTO>> getAllGrades(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) String term) {

        log.debug("Fetching grades: page={}, size={}, studentId={}, term={}", page, size, studentId, term);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<GradeDTO> response = gradeService.getAllGrades(pageable, studentId, term);
        return ResponseEntity.ok(response);
    }

    /**
     * Get grade by ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get grade by ID", description = "Retrieve grade details")
    public ResponseEntity<GradeDTO> getGradeById(@PathVariable Long id) {
        log.debug("Fetching grade: id={}", id);
        GradeDTO grade = gradeService.getGradeById(id);
        return ResponseEntity.ok(grade);
    }

    /**
     * Create a new grade.
     */
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Create grade", description = "Record a new grade for student")
    public ResponseEntity<GradeDTO> createGrade(@Valid @RequestBody CreateGradeRequest request) {
        log.info("Creating grade: studentId={}, subject={}", request.studentId(), request.subject());
        GradeDTO grade = gradeService.createGrade(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(grade);
    }

    /**
     * Update an existing grade.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Update grade", description = "Update grade information")
    public ResponseEntity<GradeDTO> updateGrade(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGradeRequest request) {
        log.info("Updating grade: id={}", id);
        GradeDTO grade = gradeService.updateGrade(id, request);
        return ResponseEntity.ok(grade);
    }

    /**
     * Delete a grade.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Delete grade", description = "Delete a grade record")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        log.info("Deleting grade: id={}", id);
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all grades for a student.
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get student's grades", description = "Retrieve all grades for specific student")
    public ResponseEntity<PageResponse<GradeDTO>> getStudentGrades(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching grades for student: studentId={}", studentId);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<GradeDTO> response = gradeService.getGradesByStudent(studentId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get grades for a student by term.
     */
    @GetMapping("/student/{studentId}/term/{term}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get student grades by term", description = "Retrieve grades for specific term")
    public ResponseEntity<PageResponse<GradeDTO>> getGradesByTerm(
            @PathVariable Long studentId,
            @PathVariable String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching grades by term: studentId={}, term={}", studentId, term);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<GradeDTO> response = gradeService.getGradesByStudentAndTerm(studentId, term, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get grade analytics for a student.
     */
    @GetMapping("/student/{studentId}/analytics")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get grade analytics", description = "Get GPA and grade trends for student")
    public ResponseEntity<?> getGradeAnalytics(@PathVariable Long studentId) {
        log.debug("Fetching grade analytics: studentId={}", studentId);
        Object analytics = gradeService.getGradeAnalytics(studentId);
        return ResponseEntity.ok(analytics);
    }
}
