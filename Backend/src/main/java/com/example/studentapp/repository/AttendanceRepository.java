package com.example.studentapp.repository;

import com.example.studentapp.entity.Attendance;
import com.example.studentapp.enums.AttendanceStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);
}
