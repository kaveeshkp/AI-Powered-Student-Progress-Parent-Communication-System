# Logging Configuration Guide

## Overview
The application uses SLF4J with Logback for comprehensive logging and audit trail tracking.

## Log Files Location
Logs are stored in the `logs/` directory by default (configurable via `LOG_PATH` environment variable):
- `logs/application.log` - General application logs
- `logs/audit.log` - Audit trail for security events (login, registration, data modifications)
- `logs/error.log` - Error-level logs only
- Compressed archives rotate automatically after 10MB (30 days retention for application logs)

## Log Levels

### Development Environment
```properties
logging.level.root=INFO
logging.level.com.example.studentapp=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web=INFO
```

### Production Environment (via Spring Profile)
```properties
spring.profiles.active=prod
logging.level.com.example.studentapp=INFO
logging.level.org.springframework.security=WARN
```

## Log Types

### 1. Authentication Logs (Audit Trail)
```
USER_REGISTRATION | email=user@example.com | role=STUDENT | timestamp=1698765432000
USER_LOGIN | email=user@example.com | role=STUDENT | ip=192.168.1.100 | timestamp=1698765432000
FAILED_LOGIN | email=user@example.com | reason=Invalid credentials | ip=192.168.1.100 | timestamp=1698765432000
INVALID_TOKEN | token=eyJh...+h2c | reason=Token expired | ip=192.168.1.100 | timestamp=1698765432000
UNAUTHORIZED_ACCESS | email=user@example.com | resource=/api/admin/users | ip=192.168.1.100 | timestamp=1698765432000
```

### 2. HTTP Request/Response Logs
```
HTTP_REQUEST | id=550e8400-e29b-41d4-a716-446655440000 | method=POST | uri=/api/auth/login | query=NONE | ip=192.168.1.100 | timestamp=1698765432000
HTTP_RESPONSE | id=550e8400-e29b-41d4-a716-446655440000 | method=POST | uri=/api/auth/login | status=200 | contentType=application/json | timestamp=1698765432001
HTTP_CLIENT_ERROR | id=550e8400-e29b-41d4-a716-446655440000 | method=POST | uri=/api/auth/login | status=401
HTTP_SERVER_ERROR | id=550e8400-e29b-41d4-a716-446655440000 | method=POST | uri=/api/auth/login | status=500
```

### 3. Application Logs
```
User registered successfully: id=1, email=user@example.com, role=STUDENT
User logged in successfully: id=1, email=user@example.com, role=STUDENT, ip=192.168.1.100
Login failed for email: user@example.com - Invalid credentials from IP: 192.168.1.100
```

### 4. Data Modification Logs (Available via AuditLogger)
```
DATA_MODIFICATION | action=CREATE | entity=User | id=1 | user=admin@example.com | details=New student account | timestamp=1698765432000
DATA_MODIFICATION | action=UPDATE | entity=Grade | id=42 | user=teacher@example.com | details=Updated grade to A | timestamp=1698765432000
DATA_MODIFICATION | action=DELETE | entity=Message | id=99 | user=user@example.com | details=Deleted spam message | timestamp=1698765432000
```

## Logging Implementation

### 1. Using @Slf4j Annotation
```java
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MyService {
    public void someMethod() {
        log.debug("Debug message");
        log.info("Info message");
        log.warn("Warning message");
        log.error("Error message");
    }
}
```

### 2. Using AuditLogger for Security Events
```java
@Service
public class AuthService {
    private final AuditLogger auditLogger;
    
    public AuthService(AuditLogger auditLogger) {
        this.auditLogger = auditLogger;
    }
    
    public void login(String email) {
        // ... login logic ...
        auditLogger.logLogin(email, "STUDENT", "192.168.1.100");
        auditLogger.logDataModification("CREATE", "Session", sessionId, email, "Login session created");
    }
}
```

### 3. HTTP Request/Response Logging
All HTTP requests and responses are automatically logged via `HttpLoggingInterceptor`:
- Request method, URI, query parameters, IP address
- Response status code and content type
- Request ID for tracing
- Automatic error detection for 4xx and 5xx responses

## Environment Variables

```bash
# Logging configuration
LOG_PATH=logs                          # Log files directory
JWT_SECRET=<32-character-key>          # JWT secret (CRITICAL: change in production)

# Development
spring.profiles.active=dev
logging.level.root=INFO
logging.level.com.example.studentapp=DEBUG

# Production
spring.profiles.active=prod
logging.level.root=WARN
logging.level.com.example.studentapp=INFO
```

## Querying Logs

### View real-time logs
```bash
tail -f logs/application.log
tail -f logs/audit.log
tail -f logs/error.log
```

### Search for specific user login attempts
```bash
grep "USER_LOGIN | email=user@example.com" logs/audit.log
```

### Search for failed login attempts
```bash
grep "FAILED_LOGIN" logs/audit.log
```

### Search for unauthorized access attempts
```bash
grep "UNAUTHORIZED_ACCESS" logs/audit.log
```

### View errors with timestamps
```bash
grep "ERROR" logs/error.log
```

### Extract logs from a specific time period
```bash
grep "2024-04-14 15:" logs/application.log
```

## Log Rotation

- **Max File Size**: 10MB per file
- **Retention**: 
  - Application logs: 30 days
  - Audit logs: 90 days
  - Error logs: 60 days
- **Total Size Cap**: 
  - Application: 1GB
  - Audit: 5GB
  - Error: 2GB
- **Format**: Compressed gzip archives with date pattern `YYYY-MM-DD.index`

## Performance Considerations

1. **String Concatenation**: Use parameterized logging to avoid string concatenation in production
   ```java
   // Good
   log.info("User {} logged in from {}", email, ipAddress);
   
   // Avoid
   log.info("User " + email + " logged in from " + ipAddress);
   ```

2. **Expensive Operations**: Check log levels before expensive operations
   ```java
   if (log.isDebugEnabled()) {
       log.debug("Complex object state: {}", expensiveToString());
   }
   ```

3. **Audit Logger Masks Sensitive Data**: Tokens are automatically masked
   ```java
   // Token stored as: eyJh...+h2c (first 4 and last 4 characters)
   auditLogger.logInvalidToken(token, "Token expired", ipAddress);
   ```

## Security Notes

⚠️ **Never log sensitive data:**
- Passwords (never, under any circumstances)
- Full JWT tokens (use AuditLogger which auto-masks)
- Full credit card numbers
- SSN or other PII

✅ **Safe to log:**
- User IDs (numeric)
- Email addresses (with PII policy consideration)
- IP addresses (for audit trail)
- Action types (login, register, etc.)
- Timestamps
- Error types (not error messages with sensitive data)

## Troubleshooting

### Logs not appearing
1. Check `LOG_PATH` is writable
2. Verify `logging.level` settings in `application.properties`
3. Check logback-spring.xml is in `src/main/resources/`
4. Ensure @Slf4j annotation is on the class

### Logs are too verbose
1. Adjust logging levels in `application.properties`
2. Use Spring profiles: `spring.profiles.active=prod`
3. Exclude unnecessary loggers (spring-framework, hibernate)

### Audit logs not being recorded
1. Ensure AuditLogger is injected in the service
2. Check that audit log appender is configured in logback-spring.xml
3. Verify `com.example.studentapp.audit` logger is not disabled

## Integration with Monitoring Tools

For production monitoring, consider integrating with:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Splunk
- DataDog
- New Relic
- CloudWatch (AWS)

These logs can be easily exported and analyzed for security monitoring and compliance.
