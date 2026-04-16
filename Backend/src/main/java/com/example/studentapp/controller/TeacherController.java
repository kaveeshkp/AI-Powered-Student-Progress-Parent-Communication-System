package com.example.studentapp.controller;

import com.example.studentapp.dto.*;
import com.example.studentapp.service.TeacherService;
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
 * REST Controller for Teacher management endpoints.
 * Provides CRUD operations for teachers.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
@Tag(name = "Teachers", description = "Teacher management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class TeacherController {

    private final TeacherService teacherService;

    /**
     * Get all teachers with pagination and sorting.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get all teachers", description = "Retrieve paginated list of teachers")
    public ResponseEntity<PageResponse<TeacherDTO>> getAllTeachers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {

        log.debug("Fetching teachers: page={}, size={}, sort={}", page, size, sort);

        String[] sortParams = sort.split(",");
        Sort.Direction direction = Sort.Direction.fromString(sortParams.length > 1 ? sortParams[1] : "desc");
        String sortField = sortParams[0];

        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(direction, sortField));
        PageResponse<TeacherDTO> response = teacherService.getAllTeachers(pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * Get teacher by ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get teacher by ID", description = "Retrieve teacher details")
    public ResponseEntity<TeacherDTO> getTeacherById(@PathVariable Long id) {
        log.debug("Fetching teacher: id={}", id);
        TeacherDTO teacher = teacherService.getTeacherById(id);
        return ResponseEntity.ok(teacher);
    }

    /**
     * Create a new teacher.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create teacher", description = "Create a new teacher")
    public ResponseEntity<TeacherDTO> createTeacher(@Valid @RequestBody CreateTeacherRequest request) {
        log.info("Creating teacher: email={}", request.email());
        TeacherDTO teacher = teacherService.createTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(teacher);
    }

    /**
     * Update an existing teacher.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update teacher", description = "Update teacher information")
    public ResponseEntity<TeacherDTO> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherDTO request) {
        log.info("Updating teacher: id={}", id);
        TeacherDTO teacher = teacherService.updateTeacher(id, request);
        return ResponseEntity.ok(teacher);
    }

    /**
     * Delete a teacher.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete teacher", description = "Delete a teacher")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        log.info("Deleting teacher: id={}", id);
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get teacher's students.
     */
    @GetMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get teacher's students", description = "Retrieve all students assigned to a teacher")
    public ResponseEntity<PageResponse<StudentDTO>> getTeacherStudents(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching students for teacher: id={}", id);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<StudentDTO> response = teacherService.getTeacherStudents(id, pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * Get grades recorded by this teacher.
     */
    @GetMapping("/{id}/grades")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get teacher's grades", description = "Retrieve all grades recorded by teacher")
    public ResponseEntity<PageResponse<GradeDTO>> getTeacherGrades(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching grades for teacher: id={}", id);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<GradeDTO> response = teacherService.getTeacherGrades(id, pageable);

        return ResponseEntity.ok(response);
    }
}
