package com.example.studentapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.studentapp.entity.User;
import com.example.studentapp.enums.RoleType;

/**
 * Repository for User entity.
 * 
 * Note: User entity doesn't have @ManyToOne or @OneToMany relationships
 * at the User level, so N+1 is not a concern for basic User queries.
 * No fetch joins needed.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<User> findByRole(RoleType role);
}
