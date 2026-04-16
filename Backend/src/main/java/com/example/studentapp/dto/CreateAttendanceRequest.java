package com.example.studentapp.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import com.example.studentapp.enums.AttendanceStatus;

/**
 * Request DTO for recording Attendance.
 */
public record CreateAttendanceRequest(
    @NotNull(message = "Student ID is required")
    Long studentId,

    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Attendance date cannot be in the future")
    LocalDate date,

    @NotNull(message = "Status is required")
    AttendanceStatus status,

    String remark
) {
}
