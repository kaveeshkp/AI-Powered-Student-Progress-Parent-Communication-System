package com.example.studentapp.controller;

import com.example.studentapp.dto.*;
import com.example.studentapp.service.AIInsightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for AI Insight management endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/ai-insights")
@RequiredArgsConstructor
@Tag(name = "AI Insights", description = "AI insight generation and retrieval endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AIInsightController {

    private final AIInsightService aiInsightService;

    /**
     * Get all AI insights with pagination.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get AI insights", description = "Retrieve paginated list of AI insights")
    public ResponseEntity<PageResponse<AIInsightDTO>> getAllInsights(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching AI insights: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<AIInsightDTO> response = aiInsightService.getAllInsights(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get AI insight by ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get insight", description = "Retrieve AI insight details")
    public ResponseEntity<AIInsightDTO> getInsightById(@PathVariable Long id) {
        log.debug("Fetching AI insight: id={}", id);
        AIInsightDTO insight = aiInsightService.getInsightById(id);
        return ResponseEntity.ok(insight);
    }

    /**
     * Generate AI insight for a student.
     */
    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Generate insight", description = "Generate AI insight for student based on performance")
    public ResponseEntity<AIInsightDTO> generateInsight(@Valid @RequestBody CreateAIInsightRequest request) {
        log.info("Generating AI insight for student: studentId={}", request.studentId());
        AIInsightDTO insight = aiInsightService.generateInsight(request.studentId());
        return ResponseEntity.status(HttpStatus.CREATED).body(insight);
    }

    /**
     * Get all insights for a student.
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get student insights", description = "Retrieve all insights for student")
    public ResponseEntity<PageResponse<AIInsightDTO>> getStudentInsights(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching insights for student: studentId={}", studentId);
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        PageResponse<AIInsightDTO> response = aiInsightService.getStudentInsights(studentId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get latest AI insight for a student.
     */
    @GetMapping("/student/{studentId}/latest")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get latest insight", description = "Retrieve most recent insight for student")
    public ResponseEntity<AIInsightDTO> getLatestInsight(@PathVariable Long studentId) {
        log.debug("Fetching latest insight for student: studentId={}", studentId);
        AIInsightDTO insight = aiInsightService.getLatestInsight(studentId);
        return ResponseEntity.ok(insight);
    }
}
