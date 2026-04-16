# Quick Reference Guide

## 🚀 Getting Started (5 minutes)

### Option 1: Docker (Recommended for quick start)
```bash
cd "Student P"
docker-compose up -d

# Access:
# - API: http://localhost:8080/api/v1
# - Swagger: http://localhost:8080/swagger-ui.html
# - Database Admin: http://localhost:8081 (Adminer)
```

### Option 2: Local Development
```bash
# Prerequisites: Java 17, MySQL 8.0+

# 1. Create database
mysql -u root -p < create_db.sql

# 2. Build
cd Backend
mvn clean install

# 3. Run
mvn spring-boot:run

# Access: http://localhost:8080/swagger-ui.html
```

---

## 📋 Implemented Endpoints (55+)

### Auth
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
```

### Students (9 endpoints)
```
GET    /api/v1/students
GET    /api/v1/students/{id}
GET    /api/v1/students/{id}/grades
GET    /api/v1/students/{id}/attendance
GET    /api/v1/students/{id}/teachers
GET    /api/v1/students/admission/{number}
POST   /api/v1/students
PUT    /api/v1/students/{id}
DELETE /api/v1/students/{id}
```

### Teachers (7 endpoints)
```
GET    /api/v1/teachers
GET    /api/v1/teachers/{id}
GET    /api/v1/teachers/{id}/students
GET    /api/v1/teachers/{id}/grades
POST   /api/v1/teachers
PUT    /api/v1/teachers/{id}
DELETE /api/v1/teachers/{id}
```

### Grades (8 endpoints)
```
GET    /api/v1/grades
GET    /api/v1/grades/{id}
GET    /api/v1/grades/student/{studentId}
GET    /api/v1/grades/student/{studentId}/term/{term}
GET    /api/v1/grades/student/{studentId}/analytics
POST   /api/v1/grades
PUT    /api/v1/grades/{id}
DELETE /api/v1/grades/{id}
```

### Attendance (8 endpoints)
```
GET    /api/v1/attendance
GET    /api/v1/attendance/{id}
GET    /api/v1/attendance/student/{studentId}
GET    /api/v1/attendance/student/{studentId}/date-range
GET    /api/v1/attendance/report  (CSV export)
POST   /api/v1/attendance
PUT    /api/v1/attendance/{id}
DELETE /api/v1/attendance/{id}
```

### Messages (6 endpoints)
```
GET    /api/v1/messages
GET    /api/v1/messages/{id}
GET    /api/v1/messages/conversation/{userId}
POST   /api/v1/messages
PUT    /api/v1/messages/{id}/read
DELETE /api/v1/messages/{id}
```

### Announcements (6 endpoints)
```
GET    /api/v1/announcements
GET    /api/v1/announcements/{id}
GET    /api/v1/announcements/by-date
POST   /api/v1/announcements
PUT    /api/v1/announcements/{id}
DELETE /api/v1/announcements/{id}
```

### Parents (6 endpoints)
```
GET    /api/v1/parents
GET    /api/v1/parents/{id}
GET    /api/v1/parents/{id}/students
POST   /api/v1/parents
PUT    /api/v1/parents/{id}
DELETE /api/v1/parents/{id}
```

### AI Insights (5 endpoints)
```
GET    /api/v1/ai-insights
GET    /api/v1/ai-insights/{id}
GET    /api/v1/ai-insights/student/{studentId}
GET    /api/v1/ai-insights/student/{studentId}/latest
POST   /api/v1/ai-insights/generate
```

---

## 🔐 Test Credentials

### Admin Account
- Email: `admin@example.com`
- Password: (Set during / seed via migrations)
- Role: ADMIN

### Teacher Account  
- Email: (From seed data V7 and V8)
- Password: (Configured)
- Role: TEACHER

### Parent Account
- Email: (From seed data)
- Password: (Configured)
- Role: PARENT

**Note**: Check database seeding migrations for actual credentials

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |
| Health Check | http://localhost:8080/actuator/health |
| Metrics | http://localhost:8080/actuator/metrics |
| Database Admin | http://localhost:8081 (when using docker-compose) |

---

## 📊 Common Queries

### Get all students with pagination
```bash
curl -X GET "http://localhost:8080/api/v1/students?page=0&size=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create a student
```bash
curl -X POST "http://localhost:8080/api/v1/students" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "admissionNumber": "STU123",
    "fullName": "John Doe",
    "dateOfBirth": "2010-05-15",
    "gradeLevel": "10",
    "section": "A"
  }'
```

### Record attendance
```bash
curl -X POST "http://localhost:8080/api/v1/attendance" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "date": "2026-04-16",
    "status": "PRESENT",
    "remark": "On time"
  }'
```

### Export attendance report
```bash
curl -X GET "http://localhost:8080/api/v1/attendance/report?from=2026-01-01&to=2026-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o attendance_report.csv
```

---

## 🛠️ Development Tips

### Add a New Endpoint
1. Create DTO in `dto/` folder
2. Create method in Controller
3. Implement business logic in Service
4. Test via Swagger UI

### Debug Issues
```bash
# Check logs
tail -f Backend/logs/application.log

# Check database
mysql -u root -p studentapp
SHOW TABLES;
SELECT * FROM app_users;

# Check API response format
curl -v http://localhost:8080/api/v1/health
```

### Environment Variables
```bash
# Development (default in docker-compose)
export DB_URL=jdbc:mysql://localhost:3306/studentapp
export JWT_SECRET=01234567890123456789012345678901

# Production
export ENFORCE_HTTPS=true
export JWT_SECRET=$(openssl rand -base64 32)
export CORS_ALLOWED_ORIGIN=https://yourdomain.com
```

---

## ✨ Features Implemented

- ✅ JWT Authentication (24-hour tokens)
- ✅ Role-Based Access Control (ADMIN, TEACHER, PARENT)
- ✅ Rate Limiting (5 req/min on auth endpoints)
- ✅ Pagination, Filtering, Sorting
- ✅ Input Validation (20+ annotations)
- ✅ Error Handling with custom exceptions
- ✅ Swagger/OpenAPI documentation
- ✅ Health checks and metrics
- ✅ Docker containerization
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Database migrations (Flyway)
- ✅ Audit logging
- ✅ CORS configuration
- ✅ Transaction management
- ✅ N+1 query prevention

---

## 📈 Next Steps

### Immediate (if not done)
1. Finish implementing remaining services
2. Write unit tests
3. Test Docker setup

### Before Production
4. Update JWT_SECRET
5. Configure CORS properly
6. Enable HTTPS enforcement
7. Run security audit
8. Load test
9. Deploy to staging

### Monthly Maintenance
10. Review audit logs
11. Update dependencies
12. Monitor metrics
13. Backup database

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8080 in use | Change port in application.properties |
| MySQL connection refused | Ensure MySQL is running: `mysql.server start` |
| 401 Unauthorized | Check JWT token, may be expired |
| 429 Too Many Requests | Rate limit exceeded, wait 60 seconds |
| Docker build fails | Ensure you're in project root with Dockerfile |

---

## 📚 Documentation Files

- `README.md` - Full setup and usage
- `IMPLEMENTATION_SUMMARY.md` - What's been built
- `Dockerfile` - Container image
- `docker-compose.yml` - Full stack setup
- `.env.example` - Configuration template
- `.github/workflows/ci-cd.yml` - CI/CD pipeline

---

**Happy coding! 🚀**

For detailed information, see README.md and IMPLEMENTATION_SUMMARY.md
