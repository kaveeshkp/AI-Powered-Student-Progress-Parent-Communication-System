package com.example.studentapp.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Utility class for audit trail logging.
 * Logs security-related events such as login, registration, and authorization changes.
 */
@Component
public class AuditLogger {
    private static final Logger auditLogger = LoggerFactory.getLogger("com.example.studentapp.audit");
    private static final Logger logger = LoggerFactory.getLogger(AuditLogger.class);

    /**
     * Log a successful user registration.
     */
    public void logRegistration(String email, String role) {
        auditLogger.info("USER_REGISTRATION | email={} | role={} | timestamp={}", 
            email, role, System.currentTimeMillis());
        logger.debug("User registered successfully: email={}, role={}", email, role);
    }

    /**
     * Log a successful user login.
     */
    public void logLogin(String email, String role, String ipAddress) {
        auditLogger.info("USER_LOGIN | email={} | role={} | ip={} | timestamp={}", 
            email, role, ipAddress, System.currentTimeMillis());
        logger.debug("User logged in: email={}, role={}", email, role);
    }

    /**
     * Log a failed login attempt.
     */
    public void logFailedLogin(String email, String reason, String ipAddress) {
        auditLogger.warn("FAILED_LOGIN | email={} | reason={} | ip={} | timestamp={}", 
            email, reason, ipAddress, System.currentTimeMillis());
        logger.warn("Failed login attempt: email={}, reason={}", email, reason);
    }

    /**
     * Log invalid JWT token access attempt.
     */
    public void logInvalidToken(String token, String reason, String ipAddress) {
        auditLogger.warn("INVALID_TOKEN | token={} | reason={} | ip={} | timestamp={}", 
            maskToken(token), reason, ipAddress, System.currentTimeMillis());
        logger.warn("Invalid token attempt: reason={}", reason);
    }

    /**
     * Log unauthorized access attempt.
     */
    public void logUnauthorizedAccess(String email, String resource, String ipAddress) {
        auditLogger.warn("UNAUTHORIZED_ACCESS | email={} | resource={} | ip={} | timestamp={}", 
            email, resource, ipAddress, System.currentTimeMillis());
        logger.warn("Unauthorized access attempt: email={}, resource={}", email, resource);
    }

    /**
     * Log data modifications (Create, Update, Delete).
     */
    public void logDataModification(String action, String entityType, String entityId, String email, String details) {
        auditLogger.info("DATA_MODIFICATION | action={} | entity={} | id={} | user={} | details={} | timestamp={}", 
            action, entityType, entityId, email, details, System.currentTimeMillis());
        logger.debug("Data {} : {}.{} by {}", action, entityType, entityId, email);
    }

    /**
     * Log security configuration changes.
     */
    public void logSecurityEvent(String eventType, String description, String email) {
        auditLogger.info("SECURITY_EVENT | type={} | description={} | user={} | timestamp={}", 
            eventType, description, email, System.currentTimeMillis());
        logger.info("Security event: type={}, description={}", eventType, description);
    }

    /**
     * Mask sensitive token information (keep only first and last 4 characters).
     */
    private String maskToken(String token) {
        if (token == null || token.length() < 8) {
            return "***";
        }
        return token.substring(0, 4) + "..." + token.substring(token.length() - 4);
    }
}
