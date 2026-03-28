package com.example.studentapp.repository;

import com.example.studentapp.entity.Parent;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentRepository extends JpaRepository<Parent, Long> {
    Optional<Parent> findByUserId(Long userId);

    List<Parent> findByStudentsId(Long studentId);
}
