package com.example.studentapp.repository;

import com.example.studentapp.entity.User;
import com.example.studentapp.enums.RoleType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    List<User> findByRole(RoleType role);

    boolean existsByEmail(String email);
}
