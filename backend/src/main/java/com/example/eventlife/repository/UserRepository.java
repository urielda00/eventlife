package com.example.eventlife.repository;

import com.example.eventlife.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "UPDATE users " +
            "SET event_created = array_append(event_created, CAST(?2 AS TEXT)), " +
            "    total_events_created = total_events_created + 1 " +
            "WHERE id = ?1", nativeQuery = true)
    int addCreatedEvent(Long userId, Long eventId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "UPDATE users " +
            "SET event_joined = array_append(event_joined, CAST(?2 AS TEXT)), " +
            "    total_events_joined = total_events_joined + 1 " +
            "WHERE id = ?1 " +
            "  AND NOT (CAST(?2 AS TEXT) = ANY(event_joined))", nativeQuery = true)
    int addJoinedEvent(Long userId, Long eventId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "UPDATE users " +
            "SET event_joined = array_remove(event_joined, CAST(?2 AS TEXT)), " +
            "    total_events_joined = GREATEST(total_events_joined - 1, 0) " +
            "WHERE id = ?1 " +
            "  AND CAST(?2 AS TEXT) = ANY(event_joined)", nativeQuery = true)
    int removeJoinedEvent(Long userId, Long eventId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "UPDATE users " +
            "SET event_created = array_remove(event_created, CAST(?1 AS TEXT)), " +
            "    total_events_created = cardinality(array_remove(event_created, CAST(?1 AS TEXT))), " +
            "    event_joined = array_remove(event_joined, CAST(?1 AS TEXT)), " +
            "    total_events_joined = cardinality(array_remove(event_joined, CAST(?1 AS TEXT))) " +
            "WHERE CAST(?1 AS TEXT) = ANY(event_created) " +
            "   OR CAST(?1 AS TEXT) = ANY(event_joined)", nativeQuery = true)
    int removeEventReferences(Long eventId);
}
