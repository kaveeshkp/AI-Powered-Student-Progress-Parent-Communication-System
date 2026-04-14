package com.example.studentapp.service;

import com.example.studentapp.dto.AuthResponse;
import com.example.studentapp.dto.LoginRequest;
import com.example.studentapp.dto.RegisterRequest;
import com.example.studentapp.entity.User;
import com.example.studentapp.exception.BadRequestException;
import com.example.studentapp.exception.UnauthorizedException;
import com.example.studentapp.repository.UserRepository;
import com.example.studentapp.security.JwtService;
import com.example.studentapp.util.AuditLogger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

@Slf4j
@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuditLogger auditLogger;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            AuditLogger auditLogger
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.auditLogger = auditLogger;
    }

    public AuthResponse register(RegisterRequest request) {
        log.debug("Registration attempt for email: {}", request.email());
        
        if (userRepository.existsByEmail(request.email())) {
            log.warn("Registration failed: Email already in use - {}", request.email());
            throw new BadRequestException("Email already in use.");
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: id={}, email={}, role={}", savedUser.getId(), savedUser.getEmail(), savedUser.getRole());
        
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().name());
        auditLogger.logRegistration(savedUser.getEmail(), savedUser.getRole().name());

        return new AuthResponse(
                token,
                "Bearer",
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().toLowerCase();
        String ipAddress = getClientIpAddress();
        
        log.debug("Login attempt for email: {} from IP: {}", email, ipAddress);
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password())
            );
        } catch (AuthenticationException ex) {
            log.warn("Login failed for email: {} - Invalid credentials from IP: {}", email, ipAddress);
            auditLogger.logFailedLogin(email, "Invalid credentials", ipAddress);
            throw new UnauthorizedException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found after successful authentication: {}", email);
                    return new UnauthorizedException("Invalid email or password.");
                });

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        log.info("User logged in successfully: id={}, email={}, role={}, ip={}", 
            user.getId(), user.getEmail(), user.getRole(), ipAddress);
        auditLogger.logLogin(user.getEmail(), user.getRole().name(), ipAddress);
        
        return new AuthResponse(token, "Bearer", user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    /**
     * Retrieves the client IP address from the request.
     */
    private String getClientIpAddress() {
        try {
            ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (requestAttributes != null) {
                HttpServletRequest request = requestAttributes.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.trace("Could not determine client IP address", e);
        }
        return "UNKNOWN";
    }
}
