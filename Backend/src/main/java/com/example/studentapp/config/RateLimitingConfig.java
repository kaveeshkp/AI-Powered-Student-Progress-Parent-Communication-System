package com.example.studentapp.config;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;

/**
 * Rate limiting configuration for protecting authentication endpoints.
 * 
 * Rate Limits:
 * - Auth endpoints: 5 requests per minute per IP
 * - Login endpoint: 3 failed attempts per minute per IP
 * 
 * This prevents brute force attacks on sensitive endpoints.
 */
@Slf4j
@Component
public class RateLimitingConfig {

    // Store buckets per IP address for auth endpoints
    private final Map<String, Bucket> authEndpointBuckets = new ConcurrentHashMap<>();
    
    // Store failed login attempts per IP
    private final Map<String, Bucket> loginFailureBuckets = new ConcurrentHashMap<>();

    /**
     * Check if auth endpoint request is allowed for the given IP
     * 
     * Limit: 5 requests per minute per IP
     */
    public boolean allowAuthEndpoint(String clientIp) {
        Bucket bucket = authEndpointBuckets.computeIfAbsent(clientIp, key -> createAuthEndpointBucket());
        
        if (bucket.tryConsume(1)) {
            return true;
        }
        
        log.warn("Rate limit exceeded for auth endpoint from IP: {}", clientIp);
        return false;
    }

    /**
     * Check if login failure is allowed for the given IP
     * 
     * Limit: 3 failed attempts per minute per IP
     */
    public boolean allowLoginFailure(String clientIp) {
        Bucket bucket = loginFailureBuckets.computeIfAbsent(clientIp, key -> createLoginFailureBucket());
        
        if (bucket.tryConsume(1)) {
            return true;
        }
        
        log.warn("Too many failed login attempts from IP: {}", clientIp);
        return false;
    }

    /**
     * Create bucket for auth endpoints: 5 requests per minute
     */
    @SuppressWarnings("deprecation")
    private Bucket createAuthEndpointBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
        return Bucket4j.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Create bucket for login failures: 3 attempts per minute
     */
    @SuppressWarnings("deprecation")
    private Bucket createLoginFailureBucket() {
        Bandwidth limit = Bandwidth.classic(3, Refill.intervally(3, Duration.ofMinutes(1)));
        return Bucket4j.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Get remaining quota for auth endpoint (for response headers)
     */
    public long getAuthEndpointQuota(String clientIp) {
        Bucket bucket = authEndpointBuckets.get(clientIp);
        if (bucket == null) {
            return 5; // Default if no bucket exists
        }
        // Check if request can be consumed; return capacity if yes, 0 if no
        return bucket.estimateAbilityToConsume(1).canBeConsumed() ? 5 : 0;
    }
}
