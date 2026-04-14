package com.example.studentapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Security startup checks and warnings.
 * 
 * Validates critical security configurations on application startup.
 * Logs warnings if potential security issues are detected.
 */
@Slf4j
@Component
public class SecurityStartupCheck {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.security.enforce-https}")
    private boolean enforceHttps;

    private final Environment environment;

    public SecurityStartupCheck(Environment environment) {
        this.environment = environment;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void checkSecurityConfiguration() {
        log.info("========================================");
        log.info("SECURITY STARTUP CHECKS");
        log.info("========================================");

        checkJwtSecret();
        checkHttpsConfiguration();
        checkEnvironment();

        log.info("========================================");
    }

    /**
     * Check JWT secret strength
     */
    private void checkJwtSecret() {
        boolean isDefault = jwtSecret.equals("01234567890123456789012345678901");
        boolean isEnvironmentSet = environment.containsProperty("JWT_SECRET");

        if (isDefault) {
            log.warn("⚠️  SECURITY WARNING: Using default JWT_SECRET!");
            log.warn("   Default secret is NOT suitable for production.");
            log.warn("   ");
            log.warn("   To fix, set environment variable:");
            log.warn("   export JWT_SECRET=$(openssl rand -base64 32)");
            log.warn("   ");
            log.warn("   Then restart the application.");
        } else if (isEnvironmentSet && jwtSecret.length() < 32) {
            log.warn("⚠️  SECURITY WARNING: JWT_SECRET is shorter than recommended.");
            log.warn("   Recommended: 32+ characters (256+ bits)");
            log.warn("   Current length: {} characters", jwtSecret.length());
        } else {
            log.info("✓ JWT_SECRET is properly configured (custom value set)");
        }
    }

    /**
     * Check HTTPS/TLS configuration
     */
    private void checkHttpsConfiguration() {
        String activeProfiles = String.join(",", environment.getActiveProfiles());

        if (activeProfiles.contains("prod") || activeProfiles.contains("production")) {
            if (!enforceHttps) {
                log.warn("⚠️  SECURITY WARNING: HTTPS enforcement is disabled in production!");
                log.warn("   To enable, set environment variable:");
                log.warn("   export ENFORCE_HTTPS=true");
            } else {
                log.info("✓ HTTPS enforcement is enabled (production)");
            }
        } else {
            log.info("ℹ️  Development mode: HTTPS enforcement is disabled (normal)");
        }
    }

    /**
     * Check environment type
     */
    private void checkEnvironment() {
        String[] activeProfiles = environment.getActiveProfiles();

        if (activeProfiles.length == 0) {
            log.info("ℹ️  No active Spring profile (using default/development)");
        } else {
            log.info("ℹ️  Active profiles: {}", String.join(", ", activeProfiles));
        }
    }
}
