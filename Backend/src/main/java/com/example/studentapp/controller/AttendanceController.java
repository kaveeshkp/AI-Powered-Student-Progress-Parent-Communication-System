package com.example.studentapp.controller;

import com.example.studentapp.dto.*;
import com.example.studentapp.service.AttendanceService;
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
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

/**
 * REST Controller for Attendance management endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Attendance management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * Get all attendance records with pagination.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get all attendance", description = "Retrieve paginated attendance records")
    public ResponseEntity<PageResponse<AttendanceDTO>> getAllAttendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching attendance: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<AttendanceDTO> response = attendanceService.getAllAttendance(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get attendance record by ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get attendance by ID", description = "Retrieve attendance record details")
    public ResponseEntity<AttendanceDTO> getAttendanceById(@PathVariable Long id) {
        log.debug("Fetching attendance: id={}", id);
        AttendanceDTO attendance = attendanceService.getAttendanceById(id);
        return ResponseEntity.ok(attendance);
    }

    /**
     * Record attendance for a student.
     */
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Record attendance", description = "Record attendance for student")
    public ResponseEntity<AttendanceDTO> recordAttendance(@Valid @RequestBody CreateAttendanceRequest request) {
        log.info("Recording attendance: studentId={}, date={}", request.studentId(), request.date());
        AttendanceDTO attendance = attendanceService.recordAttendance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
    }

    /**
     * Update attendance record.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Update attendance", description = "Update attendance record")
    public ResponseEntity<AttendanceDTO> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody CreateAttendanceRequest request) {
        log.info("Updating attendance: id={}", id);
        AttendanceDTO attendance = attendanceService.updateAttendance(id, request);
        return ResponseEntity.ok(attendance);
    }

    /**
     * Delete attendance record.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Delete attendance", description = "Delete attendance record")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        log.info("Deleting attendance: id={}", id);
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get student's attendance records.
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get student attendance", description = "Retrieve attendance records for student")
    public ResponseEntity<PageResponse<AttendanceDTO>> getStudentAttendance(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching attendance for student: studentId={}", studentId);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<AttendanceDTO> response = attendanceService.getStudentAttendance(studentId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get attendance records within date range.
     */
    @GetMapping("/student/{studentId}/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get attendance by date range", description = "Retrieve attendance for date range")
    public ResponseEntity<PageResponse<AttendanceDTO>> getAttendanceByDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching attendance: studentId={}, from={}, to={}", studentId, from, to);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<AttendanceDTO> response = attendanceService.getAttendanceByDateRange(studentId, from, to, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Generate attendance report (CSV).
     */
    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Generate attendance report", description = "Export attendance data as CSV")
    public ResponseEntity<?> generateReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        log.debug("Generating attendance report: from={}, to={}", from, to);
        byte[] csvData = attendanceService.generateReport(from, to);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=attendance_report.csv")
                .body(csvData);
    }
}
