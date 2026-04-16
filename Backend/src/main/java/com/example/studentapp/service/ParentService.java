package com.example.studentapp.service;

import com.example.studentapp.dto.*;
import com.example.studentapp.entity.Parent;
import com.example.studentapp.entity.Student;
import com.example.studentapp.entity.User;
import com.example.studentapp.enums.RoleType;
import com.example.studentapp.exception.DuplicateResourceException;
import com.example.studentapp.exception.ResourceNotFoundException;
import com.example.studentapp.repository.ParentRepository;
import com.example.studentapp.repository.StudentRepository;
import com.example.studentapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Parent business logic.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ParentService {

    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PageResponse<ParentDTO> getAllParents(Pageable pageable) {
        log.debug("Fetching all parents");
        Page<Parent> page = parentRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public ParentDTO getParentById(Long id) {
        log.debug("Fetching parent: id={}", id);
        Parent parent = parentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Parent", id));
        return toDTO(parent);
    }

    public ParentDTO createParent(CreateParentRequest request) {
        log.info("Creating parent: email={}", request.email());

        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DuplicateResourceException("User", "email", request.email());
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode("TempPassword123!"));
        user.setRole(RoleType.PARENT);
        User savedUser = userRepository.save(user);

        Parent parent = new Parent();
        parent.setUser(savedUser);
        parent.setPhoneNumber(request.phoneNumber());
        parent.setAddress(request.address());

        Parent savedParent = parentRepository.save(parent);
        log.info("Parent created: id={}", savedParent.getId());
        return toDTO(savedParent);
    }

    public ParentDTO updateParent(Long id, ParentDTO request) {
        log.info("Updating parent: id={}", id);
        Parent parent = parentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Parent", id));

        if (request.fullName() != null) {
            parent.getUser().setFullName(request.fullName());
        }

        Parent updated = parentRepository.save(parent);
        return toDTO(updated);
    }

    public void deleteParent(Long id) {
        log.info("Deleting parent: id={}", id);
        Parent parent = parentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Parent", id));

        parentRepository.delete(parent);
        userRepository.delete(parent.getUser());
    }

    @Transactional(readOnly = true)
    public PageResponse<StudentDTO> getParentChildren(Long parentId, Pageable pageable) {
        log.debug("Fetching children for parent: parentId={}", parentId);

        parentRepository.findById(parentId)
            .orElseThrow(() -> new ResourceNotFoundException("Parent", parentId));

        Page<Student> page = studentRepository.findByParentsId(parentId, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toStudentDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    private ParentDTO toDTO(Parent parent) {
        return new ParentDTO(
            parent.getId(),
            parent.getUser().getFullName(),
            parent.getUser().getEmail(),
            parent.getPhoneNumber(),
            parent.getAddress(),
            parent.getCreatedAt(),
            parent.getUpdatedAt()
        );
    }

    private StudentDTO toStudentDTO(Student student) {
        return new StudentDTO(
            student.getId(),
            student.getAdmissionNumber(),
            student.getFullName(),
            student.getDateOfBirth(),
            student.getGradeLevel(),
            student.getSection(),
            student.getCreatedAt(),
            student.getUpdatedAt()
        );
    }
}
