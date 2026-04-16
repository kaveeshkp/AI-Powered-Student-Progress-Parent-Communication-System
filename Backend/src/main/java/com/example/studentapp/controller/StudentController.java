package com.example.studentapp.controller;

import com.example.studentapp.dto.*;
import com.example.studentapp.service.StudentService;
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
 * REST Controller for Student management endpoints.
 * Provides CRUD operations and specialized queries for students.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Student management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class StudentController {

    private final StudentService studentService;

    /**
     * Get all students with pagination and sorting.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get all students", description = "Retrieve paginated list of students")
    public ResponseEntity<PageResponse<StudentDTO>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String search) {

        log.debug("Fetching students: page={}, size={}, sort={}, search={}", page, size, sort, search);

        String[] sortParams = sort.split(",");
        Sort.Direction direction = Sort.Direction.fromString(sortParams.length > 1 ? sortParams[1] : "desc");
        String sortField = sortParams[0];

        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(direction, sortField));
        PageResponse<StudentDTO> response = studentService.getAllStudents(pageable, search);

        return ResponseEntity.ok(response);
    }

    /**
     * Get student by ID with all relationships.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get student by ID", description = "Retrieve student with all details")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        log.debug("Fetching student: id={}", id);
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    /**
     * Create a new student.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create student", description = "Create a new student")
    public ResponseEntity<StudentDTO> createStudent(@Valid @RequestBody CreateStudentRequest request) {
        log.info("Creating student: admissionNumber={}", request.admissionNumber());
        StudentDTO student = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(student);
    }

    /**
     * Update an existing student.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update student", description = "Update student information")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStudentRequest request) {
        log.info("Updating student: id={}", id);
        StudentDTO student = studentService.updateStudent(id, request);
        return ResponseEntity.ok(student);
    }

    /**
     * Delete a student.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete student", description = "Delete a student and related data")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        log.info("Deleting student: id={}", id);
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get student by admission number.
     */
    @GetMapping("/admission/{admissionNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Search by admission number", description = "Find student by admission number")
    public ResponseEntity<StudentDTO> getByAdmissionNumber(@PathVariable String admissionNumber) {
        log.debug("Searching student by admission number: {}", admissionNumber);
        StudentDTO student = studentService.getByAdmissionNumber(admissionNumber);
        return ResponseEntity.ok(student);
    }

    /**
     * Get student's grades.
     */
    @GetMapping("/{id}/grades")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get student grades", description = "Retrieve all grades for a student")
    public ResponseEntity<PageResponse<GradeDTO>> getStudentGrades(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.debug("Fetching grades for student: id={}", id);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<GradeDTO> response = studentService.getStudentGrades(id, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get student's attendance records.
     */
    @GetMapping("/{id}/attendance")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get student attendance", description = "Retrieve attendance records for a student")
    public ResponseEntity<PageResponse<AttendanceDTO>> getStudentAttendance(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.debug("Fetching attendance for student: id={}", id);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<AttendanceDTO> response = studentService.getStudentAttendance(id, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get student's teachers.
     */
    @GetMapping("/{id}/teachers")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get student's teachers", description = "Retrieve all teachers assigned to a student")
    public ResponseEntity<PageResponse<TeacherDTO>> getStudentTeachers(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.debug("Fetching teachers for student: id={}", id);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<TeacherDTO> response = studentService.getStudentTeachers(id, pageable);
        return ResponseEntity.ok(response);
    }
}
