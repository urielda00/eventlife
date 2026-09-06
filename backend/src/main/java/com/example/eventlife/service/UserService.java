package com.example.eventlife.service;

import com.example.eventlife.model.User;
import com.example.eventlife.repository.UserRepository;
import com.example.eventlife.rest.dto.EventResponse;
import com.example.eventlife.rest.dto.RegisterRequest;
import com.example.eventlife.rest.dto.UserResponse;
import com.example.eventlife.security.PasswordHasher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EventService eventService;

    public UserService(UserRepository userRepository, EventService eventService) {
        this.userRepository = userRepository;
        this.eventService = eventService;
    }

    // -------------------- REGISTER --------------------
    @Transactional
    public Optional<UserResponse> register(RegisterRequest request) {
        Optional<User> existing = userRepository.findByUsername(request.getUsername());
        if (existing.isPresent()) {
            return Optional.empty();
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(PasswordHasher.hash(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPhone(request.getPhone());

        User saved = userRepository.save(user);
        return Optional.of(mapToResponse(saved));
    }

    // -------------------- GET --------------------
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                             .stream()
                             .map(this::mapToResponse)
                             .toList();
    }

    public Optional<UserResponse> getUserByIdDto(Long id) {
        return userRepository.findById(id).map(this::mapToResponse);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // -------------------- DELETE --------------------
    @Transactional
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // -------------------- EVENTS TRACKING --------------------
    @Transactional
    public void addCreatedEvent(Long userId, Long eventId) {
        userRepository.addCreatedEvent(userId, eventId);
    }

    @Transactional
    public void addJoinedEvent(Long userId, Long eventId) {
        userRepository.addJoinedEvent(userId, eventId);
    }

    @Transactional
    public void removeJoinedEvent(Long userId, Long eventId) {
        userRepository.removeJoinedEvent(userId, eventId);
    }

    // -------------------- FETCH USER EVENTS --------------------
    public List<EventResponse> getCreatedEvents(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        List<Long> ids = Optional.ofNullable(user.getEventCreated())
                                 .map(Arrays::asList)   // String[] -> List<String>
                                 .orElse(List.of())
                                 .stream()
                                 .map(Long::valueOf)
                                 .toList();

        return eventService.getEventsByIds(ids);
    }

    public List<EventResponse> getJoinedEvents(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        List<Long> ids = Optional.ofNullable(user.getEventJoined())
                                 .map(Arrays::asList)   // String[] -> List<String>
                                 .orElse(List.of())
                                 .stream()
                                 .map(Long::valueOf)
                                 .toList();

        return eventService.getEventsByIds(ids);
    }

    // -------------------- MAP --------------------
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getPhone()
        );
    }
}
