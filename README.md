# Student Application - AI-Powered Student Progress & Parent Communication System

A production-ready Spring Boot enterprise RESTful API for managing students, teachers, parents, grades, attendance, and AI-generated insights. Built with security-first principles including JWT authentication, rate limiting, role-based access control, and comprehensive API documentation.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- MySQL 8.0+
- Maven 3.8+
- Git  
- Docker (optional)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Student\ P/Backend
```

2. **Create MySQL database** (if not using Docker)
```sql
CREATE DATABASE studentapp;
CREATE USER 'studentuser'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON studentapp.* TO 'studentuser'@'localhost';
```

3. **Run with Maven**
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

4. **Access the application**
- API Base URL: http://localhost:8080/api/v1
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI Docs: http://localhost:8080/v3/api-docs
- Health Check: http://localhost:8080/actuator/health

### Using Docker

```bash
# Build image
docker build -f Dockerfile -t studentapp:latest .

# Run with docker-compose
docker-compose up -d

# Stop services
docker-compose down
```

---

## 📋 API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Students
- `GET /api/v1/students` - List all students (paginated)
- `GET /api/v1/students/{id}` - Get student details
- `POST /api/v1/students` - Create student
- `PUT /api/v1/students/{id}` - Update student
- `DELETE /api/v1/students/{id}` - Delete student
- `GET /api/v1/students/{id}/grades` - Get student's grades
- `GET /api/v1/students/{id}/attendance` - Get student's attendance
- `GET /api/v1/students/{id}/teachers` - Get student's teachers

### Teachers
- `GET /api/v1/teachers` - List all teachers
- `GET /api/v1/teachers/{id}` - Get teacher details
- `POST /api/v1/teachers` - Create teacher
- `PUT /api/v1/teachers/{id}` - Update teacher
- `DELETE /api/v1/teachers/{id}` - Delete teacher
- `GET /api/v1/teachers/{id}/students` - Get teacher's students
- `GET /api/v1/teachers/{id}/grades` - Get teacher's grades

### Grades
- `GET /api/v1/grades` - List all grades
- `GET /api/v1/grades/{id}` - Get grade details
- `POST /api/v1/grades` - Record new grade
- `PUT /api/v1/grades/{id}` - Update grade
- `DELETE /api/v1/grades/{id}` - Delete grade
- `GET /api/v1/grades/student/{studentId}` - Get student's grades
- `GET /api/v1/grades/student/{studentId}/analytics` - Get grade analytics (GPA, etc)

### Attendance
- `GET /api/v1/attendance` - List all attendance
- `POST /api/v1/attendance` - Record attendance
- `GET /api/v1/attendance/student/{studentId}` - Get student's attendance
- `GET /api/v1/attendance/report` - Export attendance as CSV

### Messages
- `GET /api/v1/messages` - Get inbox messages
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages/conversation/{userId}` - Get conversation thread

### Announcements
- `GET /api/v1/announcements` - List announcements
- `POST /api/v1/announcements` - Create announcement
- `PUT /api/v1/announcements/{id}` - Update announcement
- `DELETE /api/v1/announcements/{id}` - Delete announcement

### AI Insights
- `GET /api/v1/ai-insights` - List AI insights
- `POST /api/v1/ai-insights/generate` - Generate insight for student
- `GET /api/v1/ai-insights/student/{studentId}` - Get student insights

---

## 🔐 Authentication & Authorization

### Login Flow

1. **Register a new user**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "role": "TEACHER"
  }'
```

2. **Login and get JWT token**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

3. **Use token in requests**
```bash
curl -X GET http://localhost:8080/api/v1/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Roles & Permissions

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access to all resources |
| **TEACHER** | Create/Update grades, Attendance; View students |
| **PARENT** | View own children's info; Read announcements |

---

## 📊 Pagination & Filtering

All list endpoints support pagination:

```bash
# Basic pagination
GET /api/v1/students?page=0&size=20

# With sorting
GET /api/v1/students?page=0&size=20&sort=fullName,asc

# With search
GET /api/v1/students?search=John

# Filtering (if supported)
GET /api/v1/grades?student Id=5&term=First%20Term
```

**Response Format:**
```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5,
  "isLast": false,
  "isEmpty": false
}
```

---

## 🛡️ Security Features

### Built-in Protections
- **JWT Authentication**: Stateless token-based security with 24-hour expiration
- **Rate Limiting**: 5 requests/minute on auth endpoints, 3 failed login allowed
- **Password Hashing**: BCrypt with salt
- **CORS Configuration**: Restricted to localhost:5173-5175
- **HTTPS Enforcement**: Configurable for production
- **Input Validation**: Comprehensive validation on all endpoints
- **SQL Injection Prevention**: JPA parameterized queries
- **XSS Protection**: Framework-level protections

### Configuration for Production
```bash
# Enable HTTPS
export ENFORCE_HTTPS=true
export REQUIRE_SECURE_COOKIES=true
export ENABLE_HSTS=true

# Set strong JWT secret
export JWT_SECRET=$(openssl rand -base64 32)

# Update CORS
export CORS_ALLOWED_ORIGIN=https://yourdomain.com
```

---

## 📝 Data Models

### User
- id (PK)
- fullName
- email (unique)
- password (hashed)
- role (ADMIN, TEACHER, PARENT)
- created_at, updated_at

### Student
- id (PK)
- admissionNumber (unique)
- fullName
- dateOfBirth
- gradeLevel
- section
- Relationships: many teachers, many parents, grades, attendance

### Grade
- id (PK)
- studentId (FK)
- subject
- score (0-100)
- term
- teacherRemark
- recordedAt

### Attendance
- id (PK)
- studentId (FK)
- date
- status (PRESENT, ABSENT, LATE)
- remark

### Message
- id (PK)
- senderId (FK to User)
- receiverId (FK to User)
- content
- isRead
- sentAt

---

## 🧪 Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

### Manual Testing with Swagger
1. Go to http://localhost:8080/swagger-ui.html
2. Click "Authorize" and enter your JWT token
3. Try out any endpoint with built-in mock data

---

## 📈 Monitoring & Metrics

### Health Endpoint
```bash
curl http://localhost:8080/actuator/health
```

### Available Metrics
```bash
# All metrics
curl http://localhost:8080/actuator/metrics

# Specific metric
curl http://localhost:8080/actuator/metrics/jvm.memory.used
```

### Logs
```bash
# View application logs
tail -f logs/application.log

# Filter by level
grep "ERROR" logs/application.log
```

---

## 🚢 Deployment

### Docker Deployment
```bash
# Build image
docker build -t studentapp:1.0 .

# Run container
docker run -p 8080:8080 \
  -e DB_URL=jdbc:mysql://db:3306/studentapp \
  -e DB_USERNAME=root \
  -e JWT_SECRET=$(openssl rand -base64 32) \
  studentapp:1.0
```

### Cloud Deployment (AWS, Azure, GCP)
1. Build Docker image
2. Push to container registry
3. Deploy using service (App Service, Cloud Run, ECS)
4. Configure environment variables and MySQL instance
5. Set up domain and SSL certificate
6. Monitor with cloud-native tools

---

## 📚 Database Schema

All tables are auto-created by Flyway migrations:
- `V1__create_users_table.sql`
- `V2__create_teacher_parent_student_tables.sql`
- `V3__create_join_tables.sql`
- `V4__create_grade_attendance_tables.sql`
- `V5__create_message_announcement_ai_insight_tables.sql`
- `V6__seed_initial_data.sql`
- `V7__set_demo_admin_credentials.sql`
- `V8__set_test_credentials.sql`

---

## 🔧 Troubleshooting

### "Connection refused" on startup
```bash
# Make sure MySQL is running
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
# Docker: docker-compose up -d db
```

### JWT Token expired
- All tokens expire after 24 hours
- Login again to get a new token

### 429 Too Many Requests
- Rate limiting is active on auth endpoints (5 requests/min per IP)
- Wait 60 seconds before retrying

### Database migrations failed
```bash
# Check Flyway status
mvn flyway:info

# Clean and reset (development only!)
mvn flyway:clean flyway:migrate
```

---

## 📖 API Documentation

Full interactive documentation available at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **ReDoc**: http://localhost:8080/redoc.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

---

## 🔄 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci-cd.yml`):
1. Build on every push
2. Run tests
3. Build Docker image
4. Push to registry
5. Deploy to staging

---

## 📞 Support & Contributing

For issues, questions, or contributions:
1. Check existing GitHub issues
2. Create detailed bug reports
3. Submit pull requests with tests
4. Follow coding standards in CONTRIBUTING.md

---

## 📄 License

[Your License Here] - See LICENSE file

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Production Ready
