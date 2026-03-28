package com.example.studentapp.repository;

import com.example.studentapp.entity.Grade;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);

    List<Grade> findByStudentIdAndTerm(Long studentId, String term);
}
