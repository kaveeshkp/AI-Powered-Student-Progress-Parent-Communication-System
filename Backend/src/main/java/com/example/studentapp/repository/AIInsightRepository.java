package com.example.studentapp.repository;

import com.example.studentapp.entity.AIInsight;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIInsightRepository extends JpaRepository<AIInsight, Long> {
    List<AIInsight> findByStudentId(Long studentId);

    Page<AIInsight> findByStudentId(Long studentId, Pageable pageable);

    List<AIInsight> findByStudentIdOrderByGeneratedAtDesc(Long studentId);

    Page<AIInsight> findByStudentIdOrderByGeneratedAtDesc(Long studentId, Pageable pageable);
}
