package com.example.studentapp.repository;

import com.example.studentapp.entity.Student;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByAdmissionNumber(String admissionNumber);

    List<Student> findByTeachersId(Long teacherId);

    List<Student> findByParentsId(Long parentId);
}
