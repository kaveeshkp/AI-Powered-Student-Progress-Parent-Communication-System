# API Versioning Strategy

## Overview

This application implements API versioning using URL path versioning with the `/api/v1/` prefix. This approach allows for future API evolution while maintaining backward compatibility.

## Current API Endpoints

### Authentication Endpoints
```
POST   /api/v1/auth/register          - Register a new user
POST   /api/v1/auth/login             - User login
```

### Health Check Endpoints
```
GET    /api/v1/health                 - Application health check (public)
GET    /api/v1/secure/ping            - Authenticated health check
```

## Implementation Details

### Backend (Java/Spring Boot)

**Controller Routing:**
```java
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @PostMapping("/register")  // Resolves to: POST /api/v1/auth/register
    @PostMapping("/login")     // Resolves to: POST /api/v1/auth/login
}

@RestController
@RequestMapping("/api/v1")
public class HealthController {
    @GetMapping("/health")              // Resolves to: GET /api/v1/health
    @GetMapping("/secure/ping")         // Resolves to: GET /api/v1/secure/ping
}
```

**Security Configuration:**
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/auth/**").permitAll()      // Public auth endpoints
    .requestMatchers("/api/v1/health").permitAll()       // Public health check
    .anyRequest().authenticated()
)
```

### Frontend (React/JavaScript)

**API Client Base URL:**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"
});
```

**Service Usage:**
```javascript
// authService.js
api.post("/auth/register", payload)  // → POST /api/v1/auth/register
api.post("/auth/login", payload)     // → POST /api/v1/auth/login

// studentService.js
api.get("/students")                 // → GET /api/v1/students
api.get(`/students/${id}`)          // → GET /api/v1/students/{id}

// messageService.js
api.get("/messages/threads")        // → GET /api/v1/messages/threads
```

## Benefits

✅ **Future-Proof**: Supports multiple API versions (v1, v2, etc.) without breaking existing clients
✅ **Clear Intent**: Version number is explicit in the URL
✅ **Easy Migration**: Clients can upgrade to v2 when ready
✅ **Backward Compatibility**: v1 clients continue working while v2 is developed
✅ **Deprecation Path**: Clear timeline to deprecate older versions

## Path Versioning vs. Other Approaches

### URL Path Versioning (Current Implementation) ✅
```
/api/v1/auth/login
/api/v2/auth/login        (future versions)
```
**Pros:** Clear, browser-friendly, easy to cache
**Cons:** URL proliferation as versions increase

### Query String Versioning
```
/api/auth/login?version=1
/api/auth/login?version=2
```
**Pros:** Single URL structure
**Cons:** Less explicit, harder to cache

### Header Versioning
```
GET /api/auth/login
Header: API-Version: 1
```
**Pros:** Clean URLs
**Cons:** Not obvious from URL, not browser-friendly

### Accept Header Versioning
```
Header: Accept: application/vnd.studentapp.v1+json
```
**Pros:** Standards-based
**Cons:** Complex for clients

## Migration Path for Future Versions

### When to Create V2
- Breaking changes (removed endpoints, changed response structure)
- Major feature deprecation
- Security requirements change endpoints

### Migration Steps
1. **Create new controller** with v2 routing:
   ```java
   @RestController
   @RequestMapping("/api/v2/auth")
   public class AuthControllerV2 { }
   ```

2. **Update security config**:
   ```java
   .requestMatchers("/api/v2/auth/**").permitAll()
   ```

3. **Support both versions simultaneously** during deprecation period:
   ```
   /api/v1/auth/login  (legacy, supported for 6 months)
   /api/v2/auth/login  (new, recommended)
   ```

4. **Announce deprecation** of v1 in documentation

5. **Set sunset date** (typically 12-18 months after v2 launch):
   ```
   Warning: /api/v1 will be sunset on [DATE]
   Please migrate to /api/v2
   ```

## Environment Configuration

### Development
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Production
```
VITE_API_BASE_URL=https://api.example.com/api/v1
```

### Staging
```
VITE_API_BASE_URL=https://staging-api.example.com/api/v1
```

## Logging and Monitoring

All API requests are logged with their version:
```
HTTP_REQUEST | method=POST | uri=/api/v1/auth/login | ...
HTTP_RESPONSE | method=POST | uri=/api/v1/auth/login | status=200 | ...
```

Monitor by version:
```bash
# v1 requests
grep "/api/v1/" logs/application.log

# v2 requests (future)
grep "/api/v2/" logs/application.log

# Historical tracking
grep "uri=/api/v" logs/application.log | cut -d'|' -f3 | sort | uniq -c
```

## API Response Versioning

While the URL is versioned, consider including version info in responses for clarity:

```json
// Current (Optional Enhancement)
{
  "data": { /* response data */ },
  "meta": {
    "version": "1.0",
    "timestamp": "2024-04-14T09:30:45Z"
  }
}
```

This helps clients know which API version responded.

## Testing API Versions

### Backend Tests (Spring Boot)
```java
@Test
public void testV1AuthRegister() {
    mvc.perform(post("/api/v1/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(jsonPayload))
        .andExpect(status().isOk());
}
```

### Frontend Tests (Vitest)
```javascript
it('should call /api/v1/auth/login', async () => {
    await authService.login(credentials);
    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
    // Note: Full path becomes /api/v1/auth/login due to baseURL
});
```

## Documentation and API Schema

### OpenAPI/Swagger Integration (Recommended)
When you add OpenAPI/Swagger documentation:
```java
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Student App API")
                .version("1.0")
                .description("API Documentation"));
    }
}
```

Swagger UI will be available at:
```
/swagger-ui.html
/v3/api-docs/v1     (for v1 endpoints)
/v3/api-docs/v2     (for v2 endpoints, when available)
```

## Deprecation Headers (Future Implementation)

When deprecating v1, add headers to responses:
```java
response.setHeader("Deprecation", "true");
response.setHeader("Sunset", "Fri, 31 Dec 2024 23:59:59 GMT");
response.setHeader("Link", "</api/v2/auth/login>; rel=\"successor-version\"");
```

## Client Best Practices

### Frontend Teams
1. **Pin API version** in environment variables
2. **Test against v1** during development
3. **Monitor logs** for API version usage
4. **Plan upgrades** when v2 is announced
5. **Use feature detection** for compatibility

### Mobile Clients / Third-Party Integrations
1. **Document which version** they're using
2. **Set up monitoring** for version compatibility
3. **Create upgrade path** for each version
4. **Provide deprecation notices** 6+ months advance

## Troubleshooting

### URLs still show `/api/` instead of `/api/v1/`
- Check `VITE_API_BASE_URL` environment variable
- Verify `api.js` baseURL configuration
- Clear browser cache and rebuild frontend

### Old endpoints still accessible
- Check that both v1 and legacy endpoints exist during transition
- This is temporary during migration, not permanent

### CORS issues with versioning
- CORS is configured at `/api/**` level, so v1 subpaths are covered
- If adding new domains, update CorsConfig for `/api/v*/**`

## Related Files

- [Backend API Versionng] Backend Controllers: `AuthController.java`, `HealthController.java`
- [Security Config] Security rules: `SecurityConfig.java`
- [Frontend API Client] Axios instance: `services/api.js`
- [Test Files] API tests: `__tests__/api.test.js`

## Summary

| Aspect | Implementation |
|--------|-----------------|
| **Current Version** | v1 (with `/api/v1/` prefix) |
| **Versioning Strategy** | URL Path Versioning |
| **Supported Versions** | v1 (current), v2+ (future) |
| **Deprecation Policy** | 12-18 months notice before removal |
| **Migration Path** | Run v1 and v2 in parallel |
| **Documentation** | This guide + OpenAPI (future) |
