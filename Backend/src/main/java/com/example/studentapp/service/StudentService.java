package com.example.studentapp.service;

import com.example.studentapp.entity.Student;
import com.example.studentapp.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service for Student business logic.
 * 
 * Key points:
 * 1. @Transactional on class level provides transaction context for all methods
 * 2. Use @Transactional(readOnly = true) for read-only queries (performance optimization)
 * 3. Repositories use @Query with FETCH JOIN to prevent N+1 queries
 * 4. Since open-in-view=false, transactions must be managed here
 * 5. Don't access lazy-loaded relations after transaction ends
 */
@Slf4j
@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Get all students with pagination.
     * Uses default findAll() - only loads Student entity, not relations
     * Use when you only need basic student info.
     * 
     * @return List of students
     */
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        log.debug("Fetching all students");
        return studentRepository.findAll();
    }

    /**
     * Get student by ID with all details (grades, attendance, etc.).
     * Uses custom query with FETCH JOIN to load all related data in one query.
     * Prevents N+1: all related collections loaded with single database hit.
     * 
     * @param studentId the student ID
     * @return Optional containing student with details
     */
    @Transactional(readOnly = true)
    public Optional<Student> getStudentWithDetails(Long studentId) {
        log.debug("Fetching student with details: id={}", studentId);
        return studentRepository.findByIdWithDetails(studentId);
    }

    /**
     * Get student by ID with teachers only (light fetch).
     * Use for list views where only teacher info needed.
     * Prevents unnecessary loading of grades/attendance.
     * 
     * @param studentId the student ID
     * @return Optional containing student with teachers
     */
    @Transactional(readOnly = true)
    public Optional<Student> getStudentWithTeachers(Long studentId) {
        log.debug("Fetching student with teachers: id={}", studentId);
        return studentRepository.findByIdWithTeachers(studentId);
    }

    /**
     * Get student by basic ID without relations.
     * Use only when you don't need related data.
     * Fastest option with minimal memory footprint.
     * 
     * @param studentId the student ID
     * @return Optional containing student
     */
    @Transactional(readOnly = true)
    public Optional<Student> getStudent(Long studentId) {
        log.debug("Fetching student: id={}", studentId);
        return studentRepository.findById(studentId);
    }

    /**
     * Get all students for a teacher.
     * Uses FETCH JOIN to load teachers and their students efficiently.
     * Prevents N+1: single query with appropriate joins.
     * 
     * @param teacherId the teacher ID
     * @return List of students taught by this teacher
     */
    @Transactional(readOnly = true)
    public List<Student> getStudentsForTeacher(Long teacherId) {
        log.debug("Fetching students for teacher: id={}", teacherId);
        return studentRepository.findByTeachersId(teacherId);
    }

    /**
     * Get all students for a parent.
     * Uses FETCH JOIN to load parents and their students efficiently.
     * Prevents N+1: single query with appropriate joins.
     * 
     * @param parentId the parent ID
     * @return List of students assigned to this parent
     */
    @Transactional(readOnly = true)
    public List<Student> getStudentsForParent(Long parentId) {
        log.debug("Fetching students for parent: id={}", parentId);
        return studentRepository.findByParentsId(parentId);
    }

    /**
     * Find student by admission number.
     * 
     * @param admissionNumber the student's admission number
     * @return Optional containing student
     */
    @Transactional(readOnly = true)
    public Optional<Student> findByAdmissionNumber(String admissionNumber) {
        log.debug("Finding student by admission number: {}", admissionNumber);
        return studentRepository.findByAdmissionNumber(admissionNumber);
    }

    /**
     * Create a new student (write operation).
     * Must be in transaction (provided by @Transactional on class).
     * Remember: Transaction ends when method returns.
     * Don't access lazy relations after this returns.
     * 
     * @param student the student entity to save
     * @return the saved student with ID populated
     */
    public Student createStudent(Student student) {
        log.info("Creating new student: {}", student.getAdmissionNumber());
        Student saved = studentRepository.save(student);
        log.info("Student created successfully: id={}", saved.getId());
        return saved;
    }

    /**
     * Update an existing student.
     * Must be in transaction (provided by @Transactional on class).
     * 
     * @param studentId the student ID to update
     * @param studentData the updated student data
     * @return the updated student
     */
    public Student updateStudent(Long studentId, Student studentData) {
        log.info("Updating student: id={}", studentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> {
                    log.error("Student not found: id={}", studentId);
                    return new RuntimeException("Student not found: " + studentId);
                });
        
        student.setFullName(studentData.getFullName());
        student.setGradeLevel(studentData.getGradeLevel());
        student.setSection(studentData.getSection());
        
        Student updated = studentRepository.save(student);
        log.info("Student updated successfully: id={}", updated.getId());
        return updated;
    }

    /**
     * Delete a student.
     * Must be in transaction (provided by @Transactional on class).
     * 
     * @param studentId the student ID to delete
     */
    public void deleteStudent(Long studentId) {
        log.info("Deleting student: id={}", studentId);
        studentRepository.deleteById(studentId);
        log.info("Student deleted successfully: id={}", studentId);
    }
}
