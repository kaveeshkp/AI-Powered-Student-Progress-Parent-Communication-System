CREATE TABLE teacher_students (
    teacher_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    CONSTRAINT pk_teacher_students PRIMARY KEY (teacher_id, student_id),
    CONSTRAINT fk_teacher_students_teacher FOREIGN KEY (teacher_id) REFERENCES teachers (id),
    CONSTRAINT fk_teacher_students_student FOREIGN KEY (student_id) REFERENCES students (id)
);

CREATE TABLE parent_students (
    parent_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    CONSTRAINT pk_parent_students PRIMARY KEY (parent_id, student_id),
    CONSTRAINT fk_parent_students_parent FOREIGN KEY (parent_id) REFERENCES parents (id),
    CONSTRAINT fk_parent_students_student FOREIGN KEY (student_id) REFERENCES students (id)
);
