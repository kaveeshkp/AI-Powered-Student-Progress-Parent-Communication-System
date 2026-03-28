package com.example.studentapp.repository;

import com.example.studentapp.entity.Teacher;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUserId(Long userId);

    List<Teacher> findByStudentsId(Long studentId);
}
