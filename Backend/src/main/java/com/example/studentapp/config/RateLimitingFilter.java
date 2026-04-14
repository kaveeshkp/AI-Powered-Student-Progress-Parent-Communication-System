package com.example.studentapp.config;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * HTTP Filter for enforcing rate limiting on protected endpoints.
 * 
 * Applies rate limiting to:
 * - /api/v1/auth/** (all authentication endpoints)
 * - User's account operations
 * 
 * Returns 429 (Too Many Requests) when limit is exceeded.
 */
@Slf4j
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimitingConfig rateLimitingConfig;

    public RateLimitingFilter(RateLimitingConfig rateLimitingConfig) {
        this.rateLimitingConfig = rateLimitingConfig;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String requestUri = request.getRequestURI();
        
        // Apply rate limiting to auth endpoints
        if (requestUri.startsWith("/api/v1/auth")) {
            String clientIp = getClientIpAddress(request);
            
            // Special handling for login failures
            if (requestUri.contains("/login")) {
                // Rate limit is checked in AuthService and enforced via authentication failure
                // For now, allow the request to proceed - AuthService will check failed attempts
            }
            
            // General auth endpoint rate limiting
            if (!rateLimitingConfig.allowAuthEndpoint(clientIp)) {
                response.setStatus(429); // Too Many Requests
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Too many authentication requests. Please try again later.\"}");
                log.warn("Rate limit exceeded for IP: {} on endpoint: {}", clientIp, requestUri);
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }

    /**
     * Extract client IP address from request headers.
     * Checks multiple header sources for proxy support.
     */
    private String getClientIpAddress(HttpServletRequest request) {
        // Check X-Forwarded-For header (proxy)
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        // Check X-Real-IP header (nginx)
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        // Fallback to remote address
        return request.getRemoteAddr();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Don't apply rate limiting to health check endpoints
        String path = request.getRequestURI();
        return path.startsWith("/api/v1/health") || path.startsWith("/api/health");
    }
}
