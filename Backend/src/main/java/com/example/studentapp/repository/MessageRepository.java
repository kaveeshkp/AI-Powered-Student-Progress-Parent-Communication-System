package com.example.studentapp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.studentapp.entity.Message;

/**
 * Repository for Message entity.
 *
 * Note on fetch strategies:
 * - Message has @ManyToOne with User (sender and receiver, both LAZY)
 * - Use @Query with FETCH JOIN when User data is needed
 * - Query methods that access sender/receiver will trigger N+1 without fetch joins
 */
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Find messages received by a user (paginated).
     * Prevents N+1: avoids repeated user queries for sender/receiver
     */
    @Query("SELECT m FROM Message m " +
           "LEFT JOIN FETCH m.sender " +
           "WHERE m.receiver.id = :receiverId")
    Page<Message> findByReceiverId(@Param("receiverId") Long receiverId, Pageable pageable);

    /**
     * Find messages between users with user information.
     * Prevents N+1: avoids repeated user queries for sender/receiver
     */
    @Query("SELECT m FROM Message m " +
           "LEFT JOIN FETCH m.sender " +
           "LEFT JOIN FETCH m.receiver " +
           "WHERE (m.sender.id = :userId OR m.receiver.id = :userId)")
    List<Message> findBySenderIdOrReceiverId(@Param("userId") Long userId);

    /**
     * Find conversation thread between two users with user information.
     * Fetches both users to prevent N+1 queries
     */
    @Query("SELECT m FROM Message m " +
           "LEFT JOIN FETCH m.sender " +
           "LEFT JOIN FETCH m.receiver " +
           "WHERE ((m.sender.id = :senderId AND m.receiver.id = :receiverId) " +
           "    OR (m.sender.id = :receiverId AND m.receiver.id = :senderId)) " +
           "ORDER BY m.sentAt ASC")
    List<Message> findConversationThread(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    /**
     * Original method kept for backward compatibility but should use findConversationThread instead.
     * This signature is confusing with 4 parameters - consider using the cleaner version above.
     */
    @Query("SELECT m FROM Message m " +
           "LEFT JOIN FETCH m.sender " +
           "LEFT JOIN FETCH m.receiver " +
           "WHERE (m.sender.id = :senderId AND m.receiver.id = :receiverId) " +
           "    OR (m.sender.id = :reverseSenderId AND m.receiver.id = :reverseReceiverId) " +
           "ORDER BY m.sentAt ASC")
    List<Message> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderBySentAtAsc(
            @Param("senderId") Long senderId,
            @Param("receiverId") Long receiverId,
            @Param("reverseSenderId") Long reverseSenderId,
            @Param("reverseReceiverId") Long reverseReceiverId
    );
}
