package com.example.studentapp.service;

import com.example.studentapp.dto.AuthResponse;
import com.example.studentapp.dto.LoginRequest;
import com.example.studentapp.dto.RegisterRequest;
import com.example.studentapp.entity.User;
import com.example.studentapp.exception.BadRequestException;
import com.example.studentapp.exception.UnauthorizedException;
import com.example.studentapp.repository.UserRepository;
import com.example.studentapp.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already in use.");
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().name());

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
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
            );
        } catch (AuthenticationException ex) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, "Bearer", user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
