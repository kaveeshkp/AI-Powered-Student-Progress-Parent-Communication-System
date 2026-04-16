package com.example.studentapp.service;

import com.example.studentapp.dto.*;
import com.example.studentapp.entity.Announcement;
import com.example.studentapp.entity.User;
import com.example.studentapp.exception.ResourceNotFoundException;
import com.example.studentapp.repository.AnnouncementRepository;
import com.example.studentapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

/**
 * Service for Announcement business logic.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PageResponse<AnnouncementDTO> getAllAnnouncements(Pageable pageable) {
        log.debug("Fetching all announcements");
        Page<Announcement> page = announcementRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public AnnouncementDTO getAnnouncementById(Long id) {
        log.debug("Fetching announcement: id={}", id);
        Announcement announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Announcement", id));
        return toDTO(announcement);
    }

    public AnnouncementDTO createAnnouncement(Long creatorId, CreateAnnouncementRequest request) {
        log.info("Creating announcement: title={}", request.title());

        User creator = userRepository.findById(creatorId)
            .orElseThrow(() -> new ResourceNotFoundException("User", creatorId));

        Announcement announcement = new Announcement();
        announcement.setTitle(request.title());
        announcement.setContent(request.content());
        announcement.setCreatedBy(creator);

        Announcement saved = announcementRepository.save(announcement);
        return toDTO(saved);
    }

    public AnnouncementDTO updateAnnouncement(Long id, UpdateAnnouncementRequest request) {
        log.info("Updating announcement: id={}", id);
        Announcement announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Announcement", id));

        if (request.title() != null) {
            announcement.setTitle(request.title());
        }
        if (request.content() != null) {
            announcement.setContent(request.content());
        }

        Announcement updated = announcementRepository.save(announcement);
        return toDTO(updated);
    }

    public void deleteAnnouncement(Long id) {
        log.info("Deleting announcement: id={}", id);
        Announcement announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Announcement", id));
        announcementRepository.delete(announcement);
    }

    @Transactional(readOnly = true)
    public PageResponse<AnnouncementDTO> getByDateRange(LocalDate from, LocalDate to, Pageable pageable) {
        log.debug("Fetching announcements by date: from={}, to={}", from, to);
        Page<Announcement> page = announcementRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    private AnnouncementDTO toDTO(Announcement announcement) {
        return new AnnouncementDTO(
            announcement.getId(),
            announcement.getTitle(),
            announcement.getContent(),
            announcement.getCreatedBy().getId(),
            announcement.getCreatedBy().getFullName(),
            announcement.getCreatedAt(),
            announcement.getUpdatedAt()
        );
    }
}
