package com.example.eventlife.repository;

import com.example.eventlife.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    // Find all items for a specific event
    List<Item> findByEventId(Long eventId);

    // Find all items brought by a specific user
    List<Item> findByUserId(Long userId);

    // Find all items a specific user brings to a specific event
    List<Item> findByEventIdAndUserId(Long eventId, Long userId);

    long deleteByEventId(Long eventId);
}
