package com.example.studentapp.config;

import com.example.studentapp.repository.AIInsightRepository;
import com.example.studentapp.repository.AnnouncementRepository;
import com.example.studentapp.repository.AttendanceRepository;
import com.example.studentapp.repository.GradeRepository;
import com.example.studentapp.repository.MessageRepository;
import com.example.studentapp.repository.ParentRepository;
import com.example.studentapp.repository.StudentRepository;
import com.example.studentapp.repository.TeacherRepository;
import com.example.studentapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
public class DevDataVerificationRunner {

    @Bean
    CommandLineRunner verifySeedDataCounts(
            UserRepository userRepository,
            TeacherRepository teacherRepository,
            ParentRepository parentRepository,
            StudentRepository studentRepository,
            GradeRepository gradeRepository,
            AttendanceRepository attendanceRepository,
            MessageRepository messageRepository,
            AnnouncementRepository announcementRepository,
            AIInsightRepository aiInsightRepository
    ) {
        return args -> {
            System.out.println("=== Development Verification: Entity Counts ===");
            System.out.println("Users: " + userRepository.count());
            System.out.println("Teachers: " + teacherRepository.count());
            System.out.println("Parents: " + parentRepository.count());
            System.out.println("Students: " + studentRepository.count());
            System.out.println("Grades: " + gradeRepository.count());
            System.out.println("Attendance: " + attendanceRepository.count());
            System.out.println("Messages: " + messageRepository.count());
            System.out.println("Announcements: " + announcementRepository.count());
            System.out.println("AI Insights: " + aiInsightRepository.count());
            System.out.println("=== End Development Verification ===");
        };
    }
}
