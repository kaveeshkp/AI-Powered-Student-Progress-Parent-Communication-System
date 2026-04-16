package com.example.studentapp.service;

import com.example.studentapp.dto.*;
import com.example.studentapp.entity.Grade;
import com.example.studentapp.entity.Student;
import com.example.studentapp.entity.Teacher;
import com.example.studentapp.exception.ResourceNotFoundException;
import com.example.studentapp.repository.GradeRepository;
import com.example.studentapp.repository.StudentRepository;
import com.example.studentapp.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Grade business logic.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    @Transactional(readOnly = true)
    public PageResponse<GradeDTO> getAllGrades(Pageable pageable, Long studentId, String term) {
        log.debug("Fetching grades with pagination");
        Page<Grade> page = gradeRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public GradeDTO getGradeById(Long id) {
        log.debug("Fetching grade: id={}", id);
        Grade grade = gradeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grade", id));
        return toDTO(grade);
    }

    public GradeDTO createGrade(CreateGradeRequest request) {
        log.info("Creating grade: studentId={}, subject={}", request.studentId(), request.subject());

        Student student = studentRepository.findById(request.studentId())
            .orElseThrow(() -> new ResourceNotFoundException("Student", request.studentId()));

        Grade grade = new Grade();
        grade.setStudent(student);
        grade.setSubject(request.subject());
        grade.setScore(java.math.BigDecimal.valueOf(request.score()));
        grade.setTerm(request.term());
        grade.setTeacherRemark(request.teacherRemark());

        Grade saved = gradeRepository.save(grade);
        log.info("Grade created: id={}", saved.getId());
        return toDTO(saved);
    }

    public GradeDTO updateGrade(Long id, UpdateGradeRequest request) {
        log.info("Updating grade: id={}", id);
        Grade grade = gradeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grade", id));

        if (request.score() != null) {
            grade.setScore(java.math.BigDecimal.valueOf(request.score()));
        }
        if (request.teacherRemark() != null) {
            grade.setTeacherRemark(request.teacherRemark());
        }

        Grade updated = gradeRepository.save(grade);
        return toDTO(updated);
    }

    public void deleteGrade(Long id) {
        log.info("Deleting grade: id={}", id);
        Grade grade = gradeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grade", id));
        gradeRepository.delete(grade);
    }

    @Transactional(readOnly = true)
    public PageResponse<GradeDTO> getGradesByStudent(Long studentId, Pageable pageable) {
        log.debug("Fetching grades for student: studentId={}", studentId);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        Page<Grade> page = gradeRepository.findByStudentId(studentId, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<GradeDTO> getGradesByStudentAndTerm(Long studentId, String term, Pageable pageable) {
        log.debug("Fetching grades for student: studentId={}, term={}", studentId, term);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        Page<Grade> page = gradeRepository.findByStudentIdAndTerm(studentId, term, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public GradeAnalyticsDTO getGradeAnalytics(Long studentId) {
        log.debug("Getting grade analytics for student: studentId={}", studentId);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        // Calculate GPA and analytics
        // For simplicity, returning stub data
        return new GradeAnalyticsDTO(studentId, 3.5, 85.0);
    }

    private GradeDTO toDTO(Grade grade) {
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
