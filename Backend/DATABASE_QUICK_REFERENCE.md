# Database & Transaction Management - Quick Reference

## TL;DR - The Rules

### ✅ DO THIS

1. **Add @Transactional to all services**
   ```java
   @Service
   @Transactional
   public class YourService { }
   ```

2. **Use readOnly=true for queries**
   ```java
   @Transactional(readOnly = true)
   public List<Item> getItems() { }
   ```

3. **Use FETCH JOIN in repositories**
   ```java
   @Query("SELECT e FROM Entity e LEFT JOIN FETCH e.relation WHERE e.id = :id")
   Optional<Entity> findByIdWithRelation(@Param("id") Long id);
   ```

4. **Load all data within service transaction**
   ```java
   Student student = studentService.getStudentWithDetails(id);
   // Works! All relations pre-loaded
   Set<Grade> grades = student.getGrades();
   ```

### ❌ DON'T DO THIS

1. **Don't skip @Transactional on services**
   ```java
   @Service  // ❌ No transaction!
   public class YourService { }
   ```

2. **Don't use lazy loading outside transaction**
   ```java
   Student s = studentRepository.findById(id).get();
   s.getGrades();  // ❌ LazyInitializationException
   ```

3. **Don't use implicit method names with relationships**
   ```java
   findByTeachersId(id);  // ❌ Query causes N+1
   ```

4. **Don't use EAGER loading for @OneToMany**
   ```java
   @OneToMany(fetch=EAGER)  // ❌ Cartesian product
   Set<Grades> grades;
   ```

## Configuration Is Set ✓

```properties
spring.jpa.open-in-view=false  ← Already configured correctly
```

## Pattern Templates

### Read Service Pattern

```java
@Service
@Transactional
public class StudentService {
    
    private final StudentRepository studentRepository;
    
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
    
    // Lightweight query
    @Transactional(readOnly = true)
    public Optional<Student> getStudent(Long id) {
        log.debug("Fetching student: id={}", id);
        return studentRepository.findById(id);
    }
    
    // Heavy query with all relations
    @Transactional(readOnly = true)
    public Optional<Student> getStudentWithDetails(Long id) {
        log.debug("Fetching student with details: id={}", id);
        return studentRepository.findByIdWithDetails(id);
    }
    
    // Write operation
    public Student createStudent(Student student) {
        log.info("Creating student: {}", student.getAdmissionNumber());
        return studentRepository.save(student);
    }
}
```

### Repository Pattern

```java
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    // For basic use
    List<Student> findAll();
    
    // When you need relations - explicit FETCH JOIN
    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.teachers WHERE s.id = :id")
    Optional<Student> findByIdWithTeachers(@Param("id") Long id);
    
    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.grades LEFT JOIN FETCH s.attendances WHERE s.id = :id")
    Optional<Student> findByIdWithDetails(@Param("id") Long id);
}
```

### Controller Pattern

```java
@RestController
@RequestMapping("/api/v1/students")
public class StudentController {
    
    private final StudentService studentService;
    
    // List view - use lightweight query
    @GetMapping
    public List<StudentDTO> getAllStudents() {
        return studentService.getAllStudents()
            .stream()
            .map(StudentDTO::from)
            .collect(toList());
    }
    
    // Detail view - use heavy query with all data
    @GetMapping("/{id}")
    public StudentDetailDTO getStudent(@PathVariable Long id) {
        Student student = studentService.getStudentWithDetails(id)
            .orElseThrow(() -> new StudentNotFoundException(id));
        return StudentDetailDTO.from(student);  // All data already loaded!
    }
}
```

## Query Performance Indicators

### ❌ Slow (N+1 Problem)
```
2024-04-14 10:00:00 DEBUG SQL: SELECT * FROM students WHERE id=1
2024-04-14 10:00:01 DEBUG SQL: SELECT * FROM grades WHERE student_id=1
2024-04-14 10:00:01 DEBUG SQL: SELECT * FROM attendance WHERE student_id=1
2024-04-14 10:00:01 DEBUG SQL: SELECT * FROM teachers WHERE ...
Execution time: ~500ms
```
Multiple queries to fetch related data

### ✅ Fast (FETCH JOIN)
```
2024-04-14 10:00:00 DEBUG SQL: 
    SELECT s.*, g.*, t.* 
    FROM students s
    LEFT JOIN grades g ON s.id = g.student_id
    LEFT JOIN teachers t ON ...
    WHERE s.id=1
Execution time: ~10ms
```
Single query with all needed data

## Common Scenarios

### Scenario 1: Fetch Student for List Display

**Task:** Display list of students with just name and grade level

**Solution:**
```java
// Repository - don't need FETCH JOIN
StudentRepository.findAll();

// Service
@Transactional(readOnly = true)
public List<Student> getAllStudents() {
    return studentRepository.findAll();
}

// Controller
List<StudentDTO> list = studentService.getAllStudents()
    .stream().map(StudentDTO::from).collect(toList());
// Only name, gradeLevel - no grades loaded
```

### Scenario 2: Fetch Student with All Details

**Task:** Display student profile with grades, attendance, teachers

**Solution:**
```java
// Repository - FETCH JOIN all relations
@Query("SELECT DISTINCT s FROM Student s " +
       "LEFT JOIN FETCH s.grades " +
       "LEFT JOIN FETCH s.attendances " +
       "LEFT JOIN FETCH s.teachers " +
       "WHERE s.id = :id")
Optional<Student> findByIdWithDetails(@Param("id") Long id);

// Service
@Transactional(readOnly = true)
public Optional<Student> getStudentWithDetails(Long id) {
    return studentRepository.findByIdWithDetails(id);
}

// Controller
Student s = studentService.getStudentWithDetails(id).orElseThrow();
s.getGrades();       // ✅ Already loaded
s.getAttendances();  // ✅ Already loaded
s.getTeachers();     // ✅ Already loaded
```

### Scenario 3: Update Student Data

**Task:** Create new student with validation

**Solution:**
```java
// Service - uses class-level @Transactional
@Service
@Transactional
public class StudentService {
    
    public Student createStudent(Student student) {
        // Within transaction
        validate(student);
        applyDefaults(student);
        return studentRepository.save(student);
        // Transaction commits on return
    }
}

// Controller
Student newStudent = studentService.createStudent(studentData);
// ✅ Student saved and ID populated
```

## Troubleshooting Guide

### Problem: LazyInitializationException
```
org.hibernate.LazyInitializationException: could not initialize proxy
```

**Cause:** Accessing lazy relation outside transaction

**Fix:** Load relation within service using FETCH JOIN
```java
// Before (WRONG)
Student s = studentRepository.findById(id).get();
s.getGrades();  // ❌ FAILS

// After (RIGHT)
Student s = studentRepository.findByIdWithDetails(id).get();
s.getGrades();  // ✅ WORKS
```

### Problem: Too Much Data Loaded
```
Hibernate: SELECT s.*, g.*, a.* FROM ... (Cartesian product)
```

**Cause:** Multiple LEFT JOIN fetches creates duplicate rows

**Fix:** Use DISTINCT or separate queries
```java
// Option 1: DISTINCT (removes duplicates)
@Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.grades LEFT JOIN FETCH s.attendances WHERE s.id = :id")
Optional<Student> findByIdWithDetails(@Param("id") Long id);

// Option 2: Separate queries
@Transactional(readOnly = true)
public StudentDTO getStudentWithDetails(Long id) {
    Student s = studentRepository.findById(id).get();
    Set<Grade> grades = gradeRepository.findByStudentId(id);
    Set<Attendance> attendances = attendanceRepository.findByStudentId(id);
    // Two hits but no Cartesian product
}
```

### Problem: N+1 Query Still Occurring
```
SELECT * FROM students WHERE id=1
SELECT * FROM grades WHERE student_id=1  (repeated N times)
```

**Cause:** Repository method doesn't have FETCH JOIN

**Fix:** Add @Query with FETCH JOIN
```java
// Before (WRONG - implicit method)
List<Grade> findByStudentId(Long studentId);

// After (RIGHT - explicit FETCH JOIN)
@Query("SELECT g FROM Grade g LEFT JOIN FETCH g.student WHERE g.student.id = :studentId")
List<Grade> findByStudentId(@Param("studentId") Long studentId);
```

## Monitoring in Development

### Enable SQL Logging
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.SQL=DEBUG
```

### Use Browser DevTools
- Open DevTools → Network
- Each HTTP request = one transaction
- Check how many SQL queries per HTTP request
- Should be: 1 query per request, not N

### Count Queries Manually
```java
@Test
public void countQueries() {
    // Enable Hibernate statistics
    Statistics stats = sessionFactory.getStatistics();
    stats.clear();
    
    // Execute code
    studentService.getStudentWithDetails(1L);
    
    // Check query count
    assertEquals(1, stats.getQueryExecutionCount());  // ✓ Pass
}
```

## Related Documents

- [DATABASE_TRANSACTION_MANAGEMENT.md](DATABASE_TRANSACTION_MANAGEMENT.md) - Full details
- [N_PLUS_ONE_QUERY_PREVENTION.md](N_PLUS_ONE_QUERY_PREVENTION.md) - Detailed examples
- [API_VERSIONING_STRATEGY.md](API_VERSIONING_STRATEGY.md) - API structure

## Checklist for New Services

When creating a new service, check:

- [ ] Class has `@Transactional`
- [ ] Read methods have `@Transactional(readOnly = true)`
- [ ] Repository methods use `@Query` with `FETCH JOIN`
- [ ] DISTINCT used in queries with multiple JOINs
- [ ] No lazy relations accessed outside transaction
- [ ] Appropriate load strategy chosen (lightweight vs detailed)
- [ ] Logging added for debugging
- [ ] No EAGER loading on @OneToMany

## Performance Goals

| Operation | Target |
|-----------|--------|
| Simple read | < 50ms |
| List with 100 items | < 100ms |
| Detail view | < 200ms |
| Create/Update | < 500ms |
| Delete | < 300ms |

If exceeding these, check:
1. Is there a N+1 query? (Look at logs)
2. Is there a massive FETCH JOIN? (Consider pagination)
3. Is the index missing? (Check database)
4. Is the query optimal? (Use EXPLAIN in DB)
