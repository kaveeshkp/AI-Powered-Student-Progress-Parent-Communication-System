package com.example.studentapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(
        name = "students",
        uniqueConstraints = @UniqueConstraint(name = "uk_students_admission_number", columnNames = "admission_number")
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true, exclude = {"teachers", "parents", "grades", "attendances", "aiInsights"})
public class Student extends BaseEntity {

    @NotBlank
    @Size(max = 50)
    @Column(name = "admission_number", nullable = false, length = 50, unique = true)
    private String admissionNumber;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false)
    private String fullName;

    @NotNull
    @Past
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @NotBlank
    @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String gradeLevel;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String section;

    @Builder.Default
    @ManyToMany(mappedBy = "students")
    private Set<Teacher> teachers = new HashSet<>();

    @Builder.Default
    @ManyToMany(mappedBy = "students")
    private Set<Parent> parents = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "student")
    private Set<Grade> grades = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "student")
    private Set<Attendance> attendances = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "student")
    private Set<AIInsight> aiInsights = new HashSet<>();
}
