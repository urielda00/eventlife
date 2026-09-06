package com.example.eventlife.service;

import com.example.eventlife.model.Event;
import com.example.eventlife.model.User;
import com.example.eventlife.repository.EventRepository;
import com.example.eventlife.repository.ItemRepository;
import com.example.eventlife.repository.UserRepository;
import com.example.eventlife.rest.dto.CreateEventRequest;
import com.example.eventlife.rest.dto.EventResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository, ItemRepository itemRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public EventResponse createEvent(CreateEventRequest request, Long authenticatedUserId) {
        User owner = userRepository.findById(authenticatedUserId)
                .orElseThrow(() -> new MutationException(MutationFailure.USER_NOT_FOUND));

        Event event = new Event();
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setDate(request.getDate());
        event.setEventType(request.getEventType());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setOwner(owner);
        // Retained in the request DTO for compatibility, but participant identities
        // may only be added through an authenticated join operation.
        event.setParticipants(new String[]{});
        event.setTotalParticipants(0);

        Event saved = eventRepository.save(event);
        if (userRepository.addCreatedEvent(owner.getId(), saved.getId()) != 1) {
            throw new MutationException(MutationFailure.CONSISTENCY_FAILURE);
        }
        return mapToResponse(saved);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    public Optional<EventResponse> getEventById(Long id) {
        return eventRepository.findById(id).map(this::mapToResponse);
    }

    public Optional<Event> getEventEntityById(Long id) {
        return eventRepository.findById(id);
    }

    @Transactional
    public DeleteResult deleteEvent(Long id, Long authenticatedUserId) {
        Optional<Event> event = eventRepository.findById(id);
        if (event.isEmpty()) {
            return DeleteResult.NOT_FOUND;
        }
        if (event.get().getOwner() == null || !event.get().getOwner().getId().equals(authenticatedUserId)) {
            return DeleteResult.FORBIDDEN;
        }

        itemRepository.deleteByEventId(id);
        userRepository.removeEventReferences(id);
        eventRepository.delete(event.get());
        return DeleteResult.DELETED;
    }

    @Transactional
    public EventResponse addParticipant(Long eventId, Long authenticatedUserId, String authenticatedUsername) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new MutationException(MutationFailure.EVENT_NOT_FOUND));
        if (contains(event.getParticipants(), authenticatedUsername)) {
            return mapToResponse(event);
        }
        if (event.getMaxParticipants() == null || event.getTotalParticipants() >= event.getMaxParticipants()) {
            throw new MutationException(MutationFailure.EVENT_FULL);
        }

        if (eventRepository.addParticipant(eventId, authenticatedUsername) != 1) {
            Event reloaded = eventRepository.findById(eventId)
                    .orElseThrow(() -> new MutationException(MutationFailure.EVENT_NOT_FOUND));
            if (!contains(reloaded.getParticipants(), authenticatedUsername)) {
                throw new MutationException(MutationFailure.EVENT_FULL);
            }
        }

        int updatedUsers = userRepository.addJoinedEvent(authenticatedUserId, eventId);
        if (updatedUsers != 1 && !userRepository.existsById(authenticatedUserId)) {
            throw new MutationException(MutationFailure.USER_NOT_FOUND);
        }
        return mapToResponse(eventRepository.findById(eventId).orElseThrow());
    }

    @Transactional
    public EventResponse removeParticipant(Long eventId, Long authenticatedUserId, String authenticatedUsername) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new MutationException(MutationFailure.EVENT_NOT_FOUND));
        if (!contains(event.getParticipants(), authenticatedUsername)) {
            userRepository.removeJoinedEvent(authenticatedUserId, eventId);
            return mapToResponse(event);
        }

        if (eventRepository.removeParticipant(eventId, authenticatedUsername) != 1) {
            throw new MutationException(MutationFailure.CONSISTENCY_FAILURE);
        }
        int updatedUsers = userRepository.removeJoinedEvent(authenticatedUserId, eventId);
        if (updatedUsers != 1 && !userRepository.existsById(authenticatedUserId)) {
            throw new MutationException(MutationFailure.USER_NOT_FOUND);
        }
        return mapToResponse(eventRepository.findById(eventId).orElseThrow());
    }

    public List<EventResponse> getEventsByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return eventRepository.findByIdIn(ids).stream().map(this::mapToResponse).toList();
    }

    public List<EventResponse> getEventsPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return eventRepository.findAll(pageable).stream().map(this::mapToResponse).toList();
    }

    public EventResponse mapToResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getLocation(),
                event.getDate(),
                event.getEventType(),
                event.getMaxParticipants(),
                event.getOwner() != null ? event.getOwner().getId() : null,
                event.getOwner() != null ? event.getOwner().getUsername() : null,
                event.getParticipants() != null ? Arrays.asList(event.getParticipants()) : new ArrayList<>()
        );
    }

    private boolean contains(String[] values, String expected) {
        return values != null && Arrays.asList(values).contains(expected);
    }

    public enum DeleteResult {
        DELETED,
        NOT_FOUND,
        FORBIDDEN
    }

    public enum MutationFailure {
        EVENT_NOT_FOUND,
        EVENT_FULL,
        USER_NOT_FOUND,
        CONSISTENCY_FAILURE
    }

    public static class MutationException extends RuntimeException {
        private final MutationFailure failure;

        public MutationException(MutationFailure failure) {
            super(failure.name());
            this.failure = failure;
        }

        public MutationFailure getFailure() {
            return failure;
        }
    }
}
