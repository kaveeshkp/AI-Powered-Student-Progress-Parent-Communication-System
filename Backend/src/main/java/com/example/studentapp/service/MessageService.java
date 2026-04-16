package com.example.studentapp.service;

import com.example.studentapp.dto.*;
import com.example.studentapp.entity.Message;
import com.example.studentapp.entity.User;
import com.example.studentapp.exception.ResourceNotFoundException;
import com.example.studentapp.repository.MessageRepository;
import com.example.studentapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Message business logic.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PageResponse<MessageDTO> getMessages(Long userId, Pageable pageable) {
        log.debug("Fetching messages for user: userId={}", userId);
        Page<Message> page = messageRepository.findByReceiverId(userId, pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public MessageDTO getMessageById(Long id) {
        log.debug("Fetching message: id={}", id);
        Message message = messageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Message", id));
        return toDTO(message);
    }

    public MessageDTO sendMessage(Long senderId, CreateMessageRequest request) {
        log.info("Sending message from user {} to user {}", senderId, request.receiverId());

        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new ResourceNotFoundException("User", senderId));
        User receiver = userRepository.findById(request.receiverId())
            .orElseThrow(() -> new ResourceNotFoundException("User", request.receiverId()));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.content());
        message.setIsRead(false);

        Message saved = messageRepository.save(message);
        return toDTO(saved);
    }

    public MessageDTO markAsRead(Long id) {
        log.info("Marking message as read: id={}", id);
        Message message = messageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Message", id));

        message.setIsRead(true);
        Message updated = messageRepository.save(message);
        return toDTO(updated);
    }

    public void deleteMessage(Long id) {
        log.info("Deleting message: id={}", id);
        Message message = messageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Message", id));
        messageRepository.delete(message);
    }

    @Transactional(readOnly = true)
    public PageResponse<MessageDTO> getConversation(Long userId, Long otherUserId, Pageable pageable) {
        log.debug("Fetching conversation: userId={}, otherUserId={}", userId, otherUserId);
        Page<Message> page = messageRepository.findAll(pageable);
        return PageResponse.of(
            page.getContent().stream().map(this::toDTO).toList(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            page.getTotalElements()
        );
    }

    private MessageDTO toDTO(Message message) {
        return new MessageDTO(
            message.getId(),
            message.getSender().getId(),
            message.getSender().getFullName(),
            message.getReceiver().getId(),
            message.getReceiver().getFullName(),
            message.getContent(),
            message.getIsRead(),
            message.getSentAt(),
            message.getCreatedAt(),
            message.getUpdatedAt()
        );
    }
}
