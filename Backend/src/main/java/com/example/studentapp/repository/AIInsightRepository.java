package com.example.studentapp.repository;

import com.example.studentapp.entity.AIInsight;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIInsightRepository extends JpaRepository<AIInsight, Long> {
    List<AIInsight> findByStudentId(Long studentId);

    List<AIInsight> findByStudentIdOrderByGeneratedAtDesc(Long studentId);
}
