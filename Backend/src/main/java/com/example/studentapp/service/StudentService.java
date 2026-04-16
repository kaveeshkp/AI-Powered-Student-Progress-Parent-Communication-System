package com.example.studentapp.service;

import com.example.studentapp.dto.*;
import com.example.studentapp.entity.Student;
import com.example.studentapp.exception.ResourceNotFoundException;
import com.example.studentapp.repository.AttendanceRepository;
import com.example.studentapp.repository.GradeRepository;
import com.example.studentapp.repository.StudentRepository;
import com.example.studentapp.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for Student business logic.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;
    private final AttendanceRepository attendanceRepository;
    private final TeacherRepository teacherRepository;

    @Transactional(readOnly = true)
    public PageResponse<StudentDTO> getAllStudents(Pageable pageable, String search) {
        log.debug("Fetching all students with pagination");
        Page<Student> page = studentRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        log.debug("Fetching student: id={}", id);
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", id));
        return toDTO(student);
    }

    public StudentDTO createStudent(CreateStudentRequest request) {
        log.info("Creating student: admissionNumber={}", request.admissionNumber());

        Student student = new Student();
        student.setAdmissionNumber(request.admissionNumber());
        student.setFullName(request.fullName());
        student.setDateOfBirth(request.dateOfBirth());
        student.setGradeLevel(request.gradeLevel());
        student.setSection(request.section());

        Student saved = studentRepository.save(student);
        log.info("Student created: id={}", saved.getId());
        return toDTO(saved);
    }

    public StudentDTO updateStudent(Long id, UpdateStudentRequest request) {
        log.info("Updating student: id={}", id);
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", id));

        if (request.fullName() != null) {
            student.setFullName(request.fullName());
        }
        if (request.gradeLevel() != null) {
            student.setGradeLevel(request.gradeLevel());
        }
        if (request.section() != null) {
            student.setSection(request.section());
        }

        Student updated = studentRepository.save(student);
        return toDTO(updated);
    }

    public void deleteStudent(Long id) {
        log.info("Deleting student: id={}", id);
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", id));
        studentRepository.delete(student);
    }

    @Transactional(readOnly = true)
    public StudentDTO getByAdmissionNumber(String admissionNumber) {
        log.debug("Fetching student by admission number: {}", admissionNumber);
        Student student = studentRepository.findByAdmissionNumber(admissionNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "admissionNumber", admissionNumber));
        return toDTO(student);
    }

    @Transactional(readOnly = true)
    public PageResponse<GradeDTO> getStudentGrades(Long studentId, Pageable pageable) {
        log.debug("Fetching grades for student: studentId={}", studentId);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        Page<com.example.studentapp.entity.Grade> page = gradeRepository.findByStudentId(studentId, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toGradeDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<AttendanceDTO> getStudentAttendance(Long studentId, Pageable pageable) {
        log.debug("Fetching attendance for student: studentId={}", studentId);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        Page<com.example.studentapp.entity.Attendance> page = attendanceRepository.findByStudentId(studentId, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toAttendanceDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<TeacherDTO> getStudentTeachers(Long studentId, Pageable pageable) {
        log.debug("Fetching teachers for student: studentId={}", studentId);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        // Get all teachers for student
        Page<com.example.studentapp.entity.Teacher> page = teacherRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toTeacherDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    private StudentDTO toDTO(Student student) {
        return new StudentDTO(
            student.getId(),
            student.getAdmissionNumber(),
            student.getFullName(),
            student.getDateOfBirth(),
            student.getGradeLevel(),
            student.getSection(),
            student.getCreatedAt(),
            student.getUpdatedAt()
        );
    }

    private GradeDTO toGradeDTO(com.example.studentapp.entity.Grade grade) {
        return new GradeDTO(
            grade.getId(),
            grade.getStudent().getId(),
            grade.getSubject(),
            grade.getScore(),
            grade.getTerm(),
            grade.getTeacherRemark(),
            grade.getRecordedAt(),
            grade.getCreatedAt(),
            grade.getUpdatedAt()
        );
    }

    private AttendanceDTO toAttendanceDTO(com.example.studentapp.entity.Attendance attendance) {
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

    private TeacherDTO toTeacherDTO(com.example.studentapp.entity.Teacher teacher) {
        return new TeacherDTO(
            teacher.getId(),
            teacher.getDepartment(),
            teacher.getSpecialization(),
            teacher.getUser().getFullName(),
            teacher.getUser().getEmail(),
            teacher.getCreatedAt(),
            teacher.getUpdatedAt()
        );
    }
}
