package com.example.studentapp.controller;

import com.example.studentapp.dto.AuthResponse;
import com.example.studentapp.dto.LoginRequest;
import com.example.studentapp.dto.RegisterRequest;
import com.example.studentapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Incoming registration request for email: {}", request.email());
        AuthResponse response = authService.register(request);
        log.info("Registration successful for user id: {}", response.userId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Incoming login request for email: {}", request.email());
        AuthResponse response = authService.login(request);
        log.info("Login successful for user id: {}", response.userId());
        return ResponseEntity.ok(response);
    }
}
