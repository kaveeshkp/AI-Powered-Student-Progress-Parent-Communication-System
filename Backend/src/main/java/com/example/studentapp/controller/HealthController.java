package com.example.studentapp.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/secure/ping")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','PARENT')")
    public ResponseEntity<Map<String, String>> securePing() {
        return ResponseEntity.ok(Map.of("message", "Authenticated route works"));
    }
}
