package com.example.studentapp.service;

import com.example.studentapp.dto.*;
import com.example.studentapp.entity.Teacher;
import com.example.studentapp.entity.User;
import com.example.studentapp.enums.RoleType;
import com.example.studentapp.exception.DuplicateResourceException;
import com.example.studentapp.exception.ResourceNotFoundException;
import com.example.studentapp.repository.GradeRepository;
import com.example.studentapp.repository.StudentRepository;
import com.example.studentapp.repository.TeacherRepository;
import com.example.studentapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Teacher business logic.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get all teachers with pagination.
     */
    @Transactional(readOnly = true)
    public PageResponse<TeacherDTO> getAllTeachers(Pageable pageable) {
        log.debug("Fetching all teachers with pagination");
        Page<Teacher> page = teacherRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    /**
     * Get teacher by ID.
     */
    @Transactional(readOnly = true)
    public TeacherDTO getTeacherById(Long id) {
        log.debug("Fetching teacher: id={}", id);
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));
        return toDTO(teacher);
    }

    /**
     * Create a new teacher.
     */
    public TeacherDTO createTeacher(CreateTeacherRequest request) {
        log.info("Creating teacher: email={}", request.email());

        // Check if email already exists
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DuplicateResourceException("User", "email", request.email());
        }

        // Create user first
        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode("TempPassword123!")); // TODO: Send password via email
        user.setRole(RoleType.TEACHER);
        User savedUser = userRepository.save(user);

        // Create teacher entity
        Teacher teacher = new Teacher();
        teacher.setUser(savedUser);
        teacher.setDepartment(request.department());
        teacher.setSpecialization(request.specialization());

        Teacher savedTeacher = teacherRepository.save(teacher);
        log.info("Teacher created: id={}", savedTeacher.getId());

        return toDTO(savedTeacher);
    }

    /**
     * Update an existing teacher.
     */
    public TeacherDTO updateTeacher(Long id, TeacherDTO request) {
        log.info("Updating teacher: id={}", id);

        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));

        if (request.fullName() != null) {
            teacher.getUser().setFullName(request.fullName());
        }
        if (request.department() != null) {
            teacher.setDepartment(request.department());
        }
        if (request.specialization() != null) {
            teacher.setSpecialization(request.specialization());
        }

        Teacher updated = teacherRepository.save(teacher);
        return toDTO(updated);
    }

    /**
     * Delete a teacher.
     */
    public void deleteTeacher(Long id) {
        log.info("Deleting teacher: id={}", id);

        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));

        teacherRepository.delete(teacher);
        userRepository.delete(teacher.getUser());
    }

    /**
     * Get all students assigned to a teacher.
     */
    @Transactional(readOnly = true)
    public PageResponse<StudentDTO> getTeacherStudents(Long teacherId, Pageable pageable) {
        log.debug("Fetching students for teacher: teacherId={}", teacherId);

        // Verify teacher exists
        teacherRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher", teacherId));

        Page<com.example.studentapp.entity.Student> page = studentRepository.findByTeachersId(teacherId, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toStudentDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    /**
     * Get all grades recorded by a teacher.
     */
    @Transactional(readOnly = true)
    public PageResponse<GradeDTO> getTeacherGrades(Long teacherId, Pageable pageable) {
        log.debug("Fetching grades for teacher: teacherId={}", teacherId);

        // Verify teacher exists
        teacherRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher", teacherId));

        // For simplicity, return all grades. Ideally, store teacher_id in Grade entity
        Page<com.example.studentapp.entity.Grade> page = gradeRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toGradeDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    private TeacherDTO toDTO(Teacher teacher) {
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

    private StudentDTO toStudentDTO(com.example.studentapp.entity.Student student) {
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
}
