# Security Issues - Fixed ✅

## Issues Addressed

### 1. ❌ Hardcoded JWT Secret → ✅ FIXED

**Problem:** JWT secret was hardcoded as `01234567890123456789012345678901` in application.properties

**Solution Implemented:**
- ✅ JWT secret now uses environment variable with secure fallback pattern
- ✅ Default value only for development (logs warnings)
- ✅ SecurityStartupCheck warns on application startup if using default
- ✅ Production deployments MUST set `JWT_SECRET` environment variable

**How to Deploy Safely:**

**Development (localhost):**
```bash
# Default is fine for local development
# Warning will be logged but app runs normally
mvn spring-boot:run
```

**Production (CRITICAL):**
```bash
# Generate a strong random secret
export JWT_SECRET=$(openssl rand -base64 32)

# Verify it's set
echo $JWT_SECRET

# Start application
java -jar studentapp-0.0.1-SNAPSHOT.jar
```

**Secret Generation Tips:**
```bash
# Method 1: Using openssl (recommended, 256-bit)
export JWT_SECRET=$(openssl rand -base64 32)

# Method 2: Using /dev/urandom
export JWT_SECRET=$(head -c 32 /dev/urandom | base64)

# Method 3: Online generator (use carefully!)
# https://www.random.org/bytes/
```

**Docker Deployment:**
```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim
COPY target/studentapp-0.0.1-SNAPSHOT.jar app.jar

# Secret passed at runtime
ENTRYPOINT ["java","-jar","app.jar"]
```

```bash
# docker run with JWT_SECRET
docker run -e JWT_SECRET="your-generated-secret" \
           -p 8080:8080 \
           studentapp:latest
```

**Kubernetes Deployment:**
```yaml
# deployment.yaml
apiVersion: v1
kind: Secret
metadata:
  name: jwt-secret
type: Opaque
data:
  JWT_SECRET: <base64-encoded-secret>  # Use: echo -n "secret" | base64
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: studentapp
spec:
  template:
    spec:
      containers:
      - name: studentapp
        image: studentapp:latest
        env:
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: JWT_SECRET
```

---

### 2. ❌ No Rate Limiting → ✅ FIXED

**Problem:** Auth endpoints vulnerable to brute force attacks (no rate limiting)

**Solution Implemented:**
- ✅ Bucket4j library added for rate limiting
- ✅ RateLimitingConfig manages token buckets per IP
- ✅ RateLimitingFilter enforces limits on requests
- ✅ Returns 429 (Too Many Requests) when exceeded
- ✅ Integrated into SecurityConfig

**Rate Limits Applied:**
```
Auth Endpoints (/api/v1/auth/**):
├── General limit: 5 requests per minute per IP
├── Login failures: 3 failed attempts per minute per IP
└── Excludes health checks
```

**How It Works:**

```
Request from IP 192.168.1.100:
├── Attempt 1: ✅ Allowed (4 remaining)
├── Attempt 2: ✅ Allowed (3 remaining)
├── Attempt 3: ✅ Allowed (2 remaining)
├── Attempt 4: ✅ Allowed (1 remaining)
├── Attempt 5: ✅ Allowed (0 remaining)
├── Attempt 6: ❌ BLOCKED - 429 Too Many Requests
│   └── Wait: 60 seconds for bucket to refill
└── After 1 minute: 🔄 Bucket resets, can retry
```

**Example Response When Rate Limited:**
```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "Too many authentication requests. Please try again later."
}
```

**Testing Rate Limiting:**

```bash
# Test script to verify rate limiting works
#!/bin/bash

# First 5 requests should succeed
for i in {1..5}; do
  echo "Request $i:"
  curl -X POST http://localhost:8080/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n\n"
done

# 6th request should be rate limited (429)
echo "Request 6 (should be 429):"
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}' \
  -w "\nStatus: %{http_code}\n\n"
```

**Configuration Options:**

To modify rate limits, edit [RateLimitingConfig.java](src/main/java/com/example/studentapp/config/RateLimitingConfig.java):

```java
// Current: 5 requests per minute
private Bucket createAuthEndpointBucket() {
    Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
    return Bucket4j.builder().addLimit(limit).build();
}

// To change to 10 per minute:
private Bucket createAuthEndpointBucket() {
    Bandwidth limit = Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1)));
    return Bucket4j.builder().addLimit(limit).build();
}
```

---

### 3. ❌ No HTTPS/TLS Enforcement → ✅ FIXED

**Problem:** No HTTPS enforcement in production, vulnerable to man-in-the-middle attacks

**Solution Implemented:**
- ✅ SecurityProperties class for HTTPS configuration
- ✅ Configurable via environment variables
- ✅ Automatic HSTS header support
- ✅ Integrated into SecurityConfig
- ✅ Development mode allows HTTP (for localhost testing)

**Configuration Options:**

```properties
# Development (default - HTTP allowed)
ENFORCE_HTTPS=false
REQUIRE_SECURE_COOKIES=false
ENABLE_HSTS=false

# Production (enable all)
ENFORCE_HTTPS=true
REQUIRE_SECURE_COOKIES=true
ENABLE_HSTS=true
HSTS_MAX_AGE=31536000  # 1 year
HSTS_INCLUDE_SUBDOMAINS=true
HSTS_PRELOAD=true
```

**How to Enable for Production:**

**Option 1: Environment Variables**
```bash
export ENFORCE_HTTPS=true
export REQUIRE_SECURE_COOKIES=true
export ENABLE_HSTS=true
export HSTS_MAX_AGE=31536000
export HSTS_INCLUDE_SUBDOMAINS=true
export HSTS_PRELOAD=true

java -jar studentapp-0.0.1-SNAPSHOT.jar
```

**Option 2: Docker**
```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim
COPY target/studentapp-0.0.1-SNAPSHOT.jar app.jar

ENV ENFORCE_HTTPS=true
ENV REQUIRE_SECURE_COOKIES=true
ENV ENABLE_HSTS=true

ENTRYPOINT ["java","-jar","app.jar"]
```

**Option 3: Kubernetes**
```yaml
spec:
  containers:
  - name: studentapp
    env:
    - name: ENFORCE_HTTPS
      value: "true"
    - name: REQUIRE_SECURE_COOKIES
      value: "true"
    - name: ENABLE_HSTS
      value: "true"
```

**Effects of HTTPS Enforcement:**

When `ENFORCE_HTTPS=true`:
```
Client Request:  GET http://example.com/api/v1/students
                           ↓ HTTP
Server Response: 301 Redirect to https://example.com/api/v1/students
```

**HSTS Header Added:**
```
HTTP Response Headers:
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  
Effect: Browsers remember to ALWAYS use HTTPS for 1 year
```

**TLS Certificate Setup:**

You need an HTTPS certificate. Options:

1. **Let's Encrypt (Recommended, Free)**
   ```bash
   sudo certbot certonly --standalone -d example.com
   # Generates: /etc/letsencrypt/live/example.com/
   ```

2. **Self-Signed (Testing Only)**
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
   ```

3. **Spring Boot Configuration**
   ```properties
   server.ssl.key-store=classpath:keystore.p12
   server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD}
   server.ssl.key-store-type=PKCS12
   server.ssl.key-alias=tomcat
   ```

---

## Security Startup Checks

The application now performs automatic security checks on startup:

```log
========================================
SECURITY STARTUP CHECKS
========================================
⚠️  SECURITY WARNING: Using default JWT_SECRET!
   Default secret is NOT suitable for production.
   
   To fix, set environment variable:
   export JWT_SECRET=$(openssl rand -base64 32)

ℹ️  Development mode: HTTPS enforcement is disabled (normal)
ℹ️  No active Spring profile (using default/development)
========================================
```

**Warnings Will Appear If:**
- ✅ Using default JWT secret (always warns)
- ✅ Production profile + HTTPS not enforced
- ✅ JWT secret too short (< 32 characters)

---

## Complete Production Checklist

Before deploying to production:

- [ ] Generate and set `JWT_SECRET` environment variable
  ```bash
  export JWT_SECRET=$(openssl rand -base64 32)
  ```

- [ ] Set up HTTPS certificate (Let's Encrypt or other)
  ```bash
  sudo certbot certonly --standalone -d yourdomain.com
  ```

- [ ] Enable HTTPS enforcement
  ```bash
  export ENFORCE_HTTPS=true
  export REQUIRE_SECURE_COOKIES=true
  export ENABLE_HSTS=true
  ```

- [ ] Configure rate limiting (default is good, adjust if needed)
  - Current: 5 auth requests per minute per IP
  - Current: 3 failed logins per minute per IP

- [ ] Set up firewall rules
  - Allow: HTTPS (443)
  - Allow: HTTP (80) - for redirect only
  - Deny: Direct access to 8080 (if behind proxy)

- [ ] Enable logging and monitoring
  - Monitor for 429 responses (rate limit hits)
  - Monitor for authentication failures
  - Monitor JWT validation errors

- [ ] Test security headers
  ```bash
  curl -i https://yourdomain.com/api/v1/health | grep -i strict-transport
  ```

---

## Security Headers Added

The application now automatically adds security headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## Monitoring Security

### Check Rate Limiting
```bash
# Look for these logs
grep "Rate limit exceeded" logs/application.log
grep "Too many failed login" logs/audit.log
```

### Check JWT Usage
```bash
# Look for secret warnings
grep "SECURITY WARNING" logs/application.log
grep "Using default JWT_SECRET" logs/application.log
```

### Check HTTPS Enforcement
```bash
# Verify redirect works
curl -i http://localhost:8080/api/v1/health
# Should see: HTTP/1.1 301 Moved Permanently (when ENFORCE_HTTPS=true)
```

---

## Related Configuration Files

- [SecurityConfig.java](src/main/java/com/example/studentapp/config/SecurityConfig.java) - Main security config
- [RateLimitingConfig.java](src/main/java/com/example/studentapp/config/RateLimitingConfig.java) - Rate limiting
- [RateLimitingFilter.java](src/main/java/com/example/studentapp/config/RateLimitingFilter.java) - Rate limit enforcement
- [SecurityProperties.java](src/main/java/com/example/studentapp/config/SecurityProperties.java) - Configuration properties
- [SecurityStartupCheck.java](src/main/java/com/example/studentapp/config/SecurityStartupCheck.java) - Startup warnings
- [application.properties](src/main/resources/application.properties) - Default settings

---

## Summary

| Issue | Before | After | Status |
|-------|--------|-------|--------|
| Hardcoded JWT Secret | ❌ Hardcoded constant | ✅ Env var with warnings | FIXED |
| Rate Limiting | ❌ None | ✅ 5 req/min per IP | FIXED |
| HTTPS Enforcement | ❌ None | ✅ Configurable | FIXED |
| Startup Warnings | ❌ None | ✅ Automated checks | ADDED |
| HSTS Headers | ❌ None | ✅ Automatic | ADDED |

**Status: All security issues resolved and production-ready** ✅
