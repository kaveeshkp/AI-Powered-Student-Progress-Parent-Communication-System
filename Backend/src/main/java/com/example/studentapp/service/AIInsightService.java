package com.example.studentapp.service;

import com.example.studentapp.dto.*;
import com.example.studentapp.entity.AIInsight;
import com.example.studentapp.entity.Student;
import com.example.studentapp.exception.ResourceNotFoundException;
import com.example.studentapp.repository.AIInsightRepository;
import com.example.studentapp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for AI Insight business logic.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AIInsightService {

    private final AIInsightRepository aiInsightRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public PageResponse<AIInsightDTO> getAllInsights(Pageable pageable) {
        log.debug("Fetching all AI insights");
        Page<AIInsight> page = aiInsightRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public AIInsightDTO getInsightById(Long id) {
        log.debug("Fetching AI insight: id={}", id);
        AIInsight insight = aiInsightRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("AIInsight", id));
        return toDTO(insight);
    }

    public AIInsightDTO generateInsight(Long studentId) {
        log.info("Generating AI insight for student: studentId={}", studentId);

        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        AIInsight insight = new AIInsight();
        insight.setStudent(student);
        insight.setStrengths("Strong in mathematics and science");
        insight.setWeaknesses("Needs improvement in writing skills");
        insight.setSuggestions("Focus on reading comprehension and essay writing");

        AIInsight saved = aiInsightRepository.save(insight);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<AIInsightDTO> getStudentInsights(Long studentId, Pageable pageable) {
        log.debug("Fetching insights for student: studentId={}", studentId);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        Page<AIInsight> page = aiInsightRepository.findByStudentId(studentId, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public AIInsightDTO getLatestInsight(Long studentId) {
        log.debug("Fetching latest insight for student: studentId={}", studentId);
        studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        Page<AIInsight> page = aiInsightRepository.findByStudentIdOrderByGeneratedAtDesc(studentId, Pageable.ofSize(1));

        if (page.getContent().isEmpty()) {
            throw new ResourceNotFoundException("AIInsight", "studentId", String.valueOf(studentId));
        }

        return toDTO(page.getContent().get(0));
    }

    private AIInsightDTO toDTO(AIInsight insight) {
        return new AIInsightDTO(
            insight.getId(),
            insight.getStudent().getId(),
            insight.getStrengths(),
            insight.getWeaknesses(),
            insight.getSuggestions(),
            insight.getGeneratedAt(),
            insight.getCreatedAt(),
            insight.getUpdatedAt()
        );
    }
}
