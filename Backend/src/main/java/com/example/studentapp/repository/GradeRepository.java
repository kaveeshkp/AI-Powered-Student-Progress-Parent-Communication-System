package com.example.studentapp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.studentapp.entity.Grade;

/**
 * Repository for Grade entity.
 *
 * Note on fetch strategies:
 * - Grade has @ManyToOne with Student (LAZY by default)
 * - Use @Query with FETCH JOIN when Student data is needed
 */
public interface GradeRepository extends JpaRepository<Grade, Long> {

    /**
     * Find all grades for a student without fetching student.
     * Use when you only need grade information.
     */
    List<Grade> findByStudentId(Long studentId);

    /**
     * Find all grades for a student (paginated).
     */
    Page<Grade> findByStudentId(Long studentId, Pageable pageable);

    /**
     * Find all grades for a student for a specific term with student data.
     * Prevents N+1: avoids repeated student queries
     */
    @Query("SELECT g FROM Grade g " +
           "LEFT JOIN FETCH g.student " +
           "WHERE g.student.id = :studentId AND g.term = :term")
    List<Grade> findByStudentIdAndTerm(@Param("studentId") Long studentId, @Param("term") String term);

    /**
     * Find all grades for a student for a specific term (paginated).
     */
    Page<Grade> findByStudentIdAndTerm(Long studentId, String term, Pageable pageable);

    /**
     * Find all grades with student information (for list views).
     * Prevents N+1: avoids repeated student queries
     */
    @Query("SELECT g FROM Grade g " +
           "LEFT JOIN FETCH g.student " +
           "WHERE g.student.id = :studentId")
    List<Grade> findByStudentIdWithStudent(@Param("studentId") Long studentId);
}
