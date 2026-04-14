package com.example.studentapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.studentapp.entity.Student;

/**
 * Repository for Student entity.
 * 
 * Note on fetch strategies:
 * - Use @Query with FETCH JOIN to prevent N+1 queries
 * - Default methods trigger N+1 when accessing related collections
 * - Always fetch required relations explicitly
 */
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByAdmissionNumber(String admissionNumber);

    /**
     * Find all students for a teacher.
     * Fetches students with their complete data.
     * Prevents N+1: avoids repeated teacher queries
     */
    @Query("SELECT DISTINCT s FROM Student s " +
           "LEFT JOIN FETCH s.teachers t " +
           "WHERE t.id = :teacherId")
    List<Student> findByTeachersId(@Param("teacherId") Long teacherId);

    /**
     * Find all students for a parent.
     * Fetches students with their complete data.
     * Prevents N+1: avoids repeated parent queries
     */
    @Query("SELECT DISTINCT s FROM Student s " +
           "LEFT JOIN FETCH s.parents p " +
           "WHERE p.id = :parentId")
    List<Student> findByParentsId(@Param("parentId") Long parentId);

    /**
     * Find student with all their grades (for detailed view).
     * Must use DISTINCT to avoid duplicate rows from join.
     * Alternatively, use pagination to avoid Cartesian product.
     */
    @Query("SELECT DISTINCT s FROM Student s " +
           "LEFT JOIN FETCH s.grades " +
           "LEFT JOIN FETCH s.attendances " +
           "WHERE s.id = :studentId")
    Optional<Student> findByIdWithDetails(@Param("studentId") Long studentId);

    /**
     * Find student with only teachers (light fetch).
     * Use for list views where detailed info not needed.
     */
    @Query("SELECT DISTINCT s FROM Student s " +
           "LEFT JOIN FETCH s.teachers " +
           "WHERE s.id = :studentId")
    Optional<Student> findByIdWithTeachers(@Param("studentId") Long studentId);
}
