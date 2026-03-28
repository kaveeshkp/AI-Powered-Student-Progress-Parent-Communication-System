package com.example.studentapp.repository;

import com.example.studentapp.entity.Announcement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();

    List<Announcement> findByCreatedByIdOrderByCreatedAtDesc(Long createdById);
}
