package com.example.studentapp.service;

import com.example.studentapp.entity.Grade;
import com.example.studentapp.repository.GradeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service for Grade business logic.
 * Demonstrates proper transaction management and N+1 prevention.
 */
@Slf4j
@Service
@Transactional
public class GradeService {

    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    /**
     * Get all grades for a student (lightweight).
     * Suitable when you only need grade scoresbut not student details.
     * 
     * @param studentId the student ID
     * @return List of grades
     */
    @Transactional(readOnly = true)
    public List<Grade> getGradesByStudent(Long studentId) {
        log.debug("Fetching grades for student: id={}", studentId);
        return gradeRepository.findByStudentId(studentId);
    }

    /**
     * Get all grades for a student with student data (prevents N+1).
     * Use when you need both grade and student information.
     * Single query with JOIN fetches both.
     * 
     * @param studentId the student ID
     * @return List of grades with student data
     */
    @Transactional(readOnly = true)
    public List<Grade> getGradesByStudentWithDetails(Long studentId) {
        log.debug("Fetching grades with student details: studentId={}", studentId);
        return gradeRepository.findByStudentIdWithStudent(studentId);
    }

    /**
     * Get grades for a specific term (prevents N+1).
     * 
     * @param studentId the student ID
     * @param term the term (e.g., "First Term", "Second Term")
     * @return List of grades for the term
     */
    @Transactional(readOnly = true)
    public List<Grade> getGradesByStudentAndTerm(Long studentId, String term) {
        log.debug("Fetching grades for student: id={}, term={}", studentId, term);
        return gradeRepository.findByStudentIdAndTerm(studentId, term);
    }

    /**
     * Create a new grade.
     * Write operation within transaction context.
     * 
     * @param grade the grade to create
     * @return the saved grade
     */
    public Grade createGrade(Grade grade) {
        log.info("Creating grade for student: id={}, subject={}", 
            grade.getStudent().getId(), grade.getSubject());
        Grade saved = gradeRepository.save(grade);
        log.info("Grade created: id={}", saved.getId());
        return saved;
    }

    /**
     * Update an existing grade.
     * Write operation within transaction context.
     * 
     * @param gradeId the grade ID to update
     * @param gradeData the updated grade data
     * @return the updated grade
     */
    public Grade updateGrade(Long gradeId, Grade gradeData) {
        log.info("Updating grade: id={}", gradeId);
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found: " + gradeId));
        
        grade.setSubject(gradeData.getSubject());
        grade.setScore(gradeData.getScore());
        grade.setTerm(gradeData.getTerm());
        
        Grade updated = gradeRepository.save(grade);
        log.info("Grade updated: id={}", updated.getId());
        return updated;
    }

    /**
     * Delete a grade.
     * Write operation within transaction context.
     * 
     * @param gradeId the grade ID to delete
     */
    public void deleteGrade(Long gradeId) {
        log.info("Deleting grade: id={}", gradeId);
        gradeRepository.deleteById(gradeId);
        log.info("Grade deleted: id={}", gradeId);
    }
}
