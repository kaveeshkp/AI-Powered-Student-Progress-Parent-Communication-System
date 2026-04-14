package com.example.studentapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.studentapp.entity.Teacher;

/**
 * Repository for Teacher entity.
 * 
 * Note on fetch strategies:
 * - Teacher has @ManyToOne with User (LAZY by default)
 * - Use @Query with FETCH JOIN to prevent N+1 queries when accessing User
 */
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    
    /**
     * Find teacher by user ID with user data fetched.
     * Prevents N+1: avoids repeated user queries
     */
    @Query("SELECT t FROM Teacher t " +
           "LEFT JOIN FETCH t.user " +
           "WHERE t.user.id = :userId")
    Optional<Teacher> findByUserId(@Param("userId") Long userId);

    /**
     * Find all teachers for a student.
     * Fetches teachers with user information.
     * Prevents N+1: avoids repeated user queries
     */
    @Query("SELECT DISTINCT t FROM Teacher t " +
           "LEFT JOIN FETCH t.user " +
           "LEFT JOIN FETCH t.students s " +
           "WHERE s.id = :studentId")
    List<Teacher> findByStudentsId(@Param("studentId") Long studentId);

    /**
     * Find teacher with their students (for detailed view).
     */
    @Query("SELECT DISTINCT t FROM Teacher t " +
           "LEFT JOIN FETCH t.user " +
           "LEFT JOIN FETCH t.students " +
           "WHERE t.id = :teacherId")
    Optional<Teacher> findByIdWithStudents(@Param("teacherId") Long teacherId);
}
