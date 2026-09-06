package com.example.eventlife.repository;

import com.example.eventlife.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "UPDATE events " +
            "SET participants = array_append(participants, CAST(?2 AS TEXT)), " +
            "    total_participants = total_participants + 1 " +
            "WHERE id = ?1 " +
            "  AND total_participants < max_participants " +
            "  AND NOT (CAST(?2 AS TEXT) = ANY(participants))", nativeQuery = true)
    int addParticipant(Long eventId, String username);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "UPDATE events " +
            "SET participants = array_remove(participants, CAST(?2 AS TEXT)), " +
            "    total_participants = GREATEST(total_participants - 1, 0) " +
            "WHERE id = ?1 " +
            "  AND CAST(?2 AS TEXT) = ANY(participants)", nativeQuery = true)
    int removeParticipant(Long eventId, String username);

    List<Event> findByIdIn(List<Long> ids);

    Page<Event> findAll(Pageable pageable);
}
