-- Users
INSERT INTO app_users (id, full_name, email, password, role, created_at, updated_at)
VALUES
    (1, 'Admin User', 'admin@studentapp.local', '$2a$10$placeholderEncodedAdminPasswordHash', 'ADMIN', NOW(), NOW()),
    (2, 'Nimal Perera', 'teacher@studentapp.local', '$2a$10$placeholderEncodedTeacherPasswordHash', 'TEACHER', NOW(), NOW()),
    (3, 'Sanduni Silva', 'parent@studentapp.local', '$2a$10$placeholderEncodedParentPasswordHash', 'PARENT', NOW(), NOW());

-- Core student record
INSERT INTO students (
    id,
    admission_number,
    full_name,
    date_of_birth,
    grade_level,
    section,
    created_at,
    updated_at
)
VALUES (
    1,
    'ADM-2026-001',
    'Kavindu Fernando',
    '2011-08-16',
    'Grade 8',
    'A',
    NOW(),
    NOW()
);

-- Teacher and parent profiles
INSERT INTO teachers (id, user_id, department, specialization, created_at, updated_at)
VALUES (1, 2, 'Mathematics', 'Algebra and Problem Solving', NOW(), NOW());

INSERT INTO parents (id, user_id, phone_number, address, created_at, updated_at)
VALUES (1, 3, '+94 77 123 4567', '12 Temple Road, Colombo 05', NOW(), NOW());

-- Many-to-many links
INSERT INTO teacher_students (teacher_id, student_id)
VALUES (1, 1);

INSERT INTO parent_students (parent_id, student_id)
VALUES (1, 1);

-- Grades
INSERT INTO grades (
    id,
    student_id,
    subject,
    score,
    term,
    teacher_remark,
    recorded_at,
    created_at,
    updated_at
)
VALUES
    (1, 1, 'Mathematics', 86.50, 'Term 1', 'Strong concepts, improve speed in word problems.', NOW() - INTERVAL 14 DAY, NOW(), NOW()),
    (2, 1, 'Science', 79.00, 'Term 1', 'Good understanding, needs clearer explanations in written answers.', NOW() - INTERVAL 13 DAY, NOW(), NOW()),
    (3, 1, 'English', 91.25, 'Term 1', 'Excellent reading comprehension and grammar.', NOW() - INTERVAL 12 DAY, NOW(), NOW());

-- Attendance (5 records)
INSERT INTO attendance (
    id,
    student_id,
    attendance_date,
    status,
    remark,
    created_at,
    updated_at
)
VALUES
    (1, 1, '2026-03-16', 'PRESENT', 'On time.', NOW(), NOW()),
    (2, 1, '2026-03-17', 'LATE', 'Arrived 10 minutes late.', NOW(), NOW()),
    (3, 1, '2026-03-18', 'PRESENT', 'Participated actively in class.', NOW(), NOW()),
    (4, 1, '2026-03-19', 'ABSENT', 'Medical appointment.', NOW(), NOW()),
    (5, 1, '2026-03-20', 'PRESENT', 'Good attendance recovery after absence.', NOW(), NOW());

-- Message
INSERT INTO messages (
    id,
    sender_id,
    receiver_id,
    content,
    is_read,
    sent_at,
    created_at,
    updated_at
)
VALUES (
    1,
    2,
    3,
    'Hello Mrs. Silva, Kavindu has improved in Mathematics this term. Please encourage daily practice for word problems.',
    FALSE,
    NOW() - INTERVAL 2 DAY,
    NOW(),
    NOW()
);

-- Announcement
INSERT INTO announcements (
    id,
    title,
    content,
    created_by_user_id,
    created_at,
    updated_at
)
VALUES (
    1,
    'Parent-Teacher Meeting - Term 1',
    'Parent-teacher meetings will be held on April 5th from 8:30 AM to 1:00 PM. Please book your slot through the school office.',
    1,
    NOW() - INTERVAL 3 DAY,
    NOW()
);

-- AI insight
INSERT INTO ai_insights (
    id,
    student_id,
    strengths,
    weaknesses,
    suggestions,
    generated_at,
    created_at,
    updated_at
)
VALUES (
    1,
    1,
    'Strong performance in English and consistent class participation.',
    'Occasional lateness and slower problem-solving pace in Mathematics word problems.',
    'Use a 20-minute daily timed worksheet routine for math word problems and maintain a weekly attendance checklist with parent support.',
    NOW() - INTERVAL 1 DAY,
    NOW(),
    NOW()
);
