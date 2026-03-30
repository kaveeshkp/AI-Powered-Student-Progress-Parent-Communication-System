CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admission_number VARCHAR(50) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    date_of_birth DATE NOT NULL,
    grade_level VARCHAR(30) NOT NULL,
    section VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_students_admission_number UNIQUE (admission_number)
);

CREATE TABLE teachers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    department VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_teachers_user_id UNIQUE (user_id),
    CONSTRAINT fk_teachers_user FOREIGN KEY (user_id) REFERENCES app_users (id)
);

CREATE TABLE parents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_parents_user_id UNIQUE (user_id),
    CONSTRAINT fk_parents_user FOREIGN KEY (user_id) REFERENCES app_users (id)
);
