package com.example.studentapp.service;

import com.example.studentapp.dto.*;
import com.example.studentapp.entity.Attendance;
import com.example.studentapp.entity.Student;
import com.example.studentapp.exception.ResourceNotFoundException;
import com.example.studentapp.repository.AttendanceRepository;
import com.example.studentapp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

/**
 * Service for Attendance business logic.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public PageResponse<AttendanceDTO> getAllAttendance(Pageable pageable) {
        log.debug("Fetching all attendance records");
        Page<Attendance> page = attendanceRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public AttendanceDTO getAttendanceById(Long id) {
        log.debug("Fetching attendance: id={}", id);
        Attendance attendance = attendanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Attendance", id));
        return toDTO(attendance);
    }

    public AttendanceDTO recordAttendance(CreateAttendanceRequest request) {
        log.info("Recording attendance: studentId={}, date={}", request.studentId(), request.date());

        Student student = studentRepository.findById(request.studentId())
            .orElseThrow(() -> new ResourceNotFoundException("Student", request.studentId()));

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setDate(request.date());
        attendance.setStatus(request.status());
        attendance.setRemark(request.remark());

        Attendance saved = attendanceRepository.save(attendance);
        return toDTO(saved);
    }

    public AttendanceDTO updateAttendance(Long id, CreateAttendanceRequest request) {
        log.info("Updating attendance: id={}", id);
        Attendance attendance = attendanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Attendance", id));

        attendance.setStatus(request.status());
        attendance.setRemark(request.remark());

        Attendance updated = attendanceRepository.save(attendance);
        return toDTO(updated);
    }

    public void deleteAttendance(Long id) {
        log.info("Deleting attendance: id={}", id);
        Attendance attendance = attendanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Attendance", id));
        attendanceRepository.delete(attendance);
    }

    @Transactional(readOnly = true)
    public PageResponse<AttendanceDTO> getStudentAttendance(Long studentId, Pageable pageable) {
        log.debug("Fetching attendance for student: studentId={}", studentId);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        Page<Attendance> page = attendanceRepository.findByStudentId(studentId, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<AttendanceDTO> getAttendanceByDateRange(Long studentId, LocalDate from, LocalDate to, Pageable pageable) {
        log.debug("Fetching attendance by date range: studentId={}, from={}, to={}", studentId, from, to);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        Page<Attendance> page = attendanceRepository.findByStudentIdAndDateBetween(studentId, from, to, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    public byte[] generateReport(LocalDate from, LocalDate to) {
        log.info("Generating attendance report: from={}, to={}", from, to);
        // TODO: Implement CSV export
        return new byte[0];
    }

    private AttendanceDTO toDTO(Attendance attendance) {
        return new AttendanceDTO(
            attendance.getId(),
            attendance.getStudent().getId(),
            attendance.getDate(),
            attendance.getStatus(),
            attendance.getRemark(),
            attendance.getCreatedAt(),
            attendance.getUpdatedAt()
        );
    }
}
