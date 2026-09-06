package com.example.eventlife.service;

import com.example.eventlife.model.Event;
import com.example.eventlife.model.Item;
import com.example.eventlife.model.User;
import com.example.eventlife.repository.EventRepository;
import com.example.eventlife.repository.ItemRepository;
import com.example.eventlife.repository.UserRepository;
import com.example.eventlife.rest.dto.ItemRequest;
import com.example.eventlife.rest.dto.ItemResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public ItemService(ItemRepository itemRepository, UserRepository userRepository, EventRepository eventRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    // -------------------- CREATE ITEM --------------------
    @Transactional
    public Optional<ItemResponse> createItem(ItemRequest request, Long authenticatedUserId, String authenticatedUsername) {
        Optional<Event> eventOpt = eventRepository.findById(request.getEventId());
        Optional<User> userOpt = userRepository.findById(authenticatedUserId);

        if (eventOpt.isEmpty() || userOpt.isEmpty()) {
            return Optional.empty();
        }

        Event event = eventOpt.get();
        boolean isOwner = event.getOwner() != null && event.getOwner().getId().equals(authenticatedUserId);
        boolean isParticipant = event.getParticipants() != null
                && List.of(event.getParticipants()).contains(authenticatedUsername);
        if (!isOwner && !isParticipant) {
            throw new ItemAuthorizationException();
        }

        Item item = new Item(
                request.getName(),
                request.getQuantity(),
                event,
                userOpt.get()
        );

        Item saved = itemRepository.save(item);
        return Optional.of(mapToResponse(saved));
    }

    // -------------------- GET ALL ITEMS --------------------
    public List<ItemResponse> getAllItems() {
        return itemRepository.findAll()
                             .stream()
                             .map(this::mapToResponse)
                             .collect(Collectors.toList());
    }

    // -------------------- GET ITEM BY ID --------------------
    public Optional<ItemResponse> getItemById(Long id) {
        return itemRepository.findById(id).map(this::mapToResponse);
    }

    // -------------------- GET ITEMS BY EVENT --------------------
    public List<ItemResponse> getItemsByEvent(Long eventId) {
        return itemRepository.findByEventId(eventId)
                             .stream()
                             .map(this::mapToResponse)
                             .collect(Collectors.toList());
    }

    // -------------------- GET ITEMS BY USER --------------------
    public List<ItemResponse> getItemsByUser(Long userId) {
        return itemRepository.findByUserId(userId)
                             .stream()
                             .map(this::mapToResponse)
                             .collect(Collectors.toList());
    }

    // -------------------- DELETE ITEM --------------------
    @Transactional
    public DeleteResult deleteItem(Long id, Long authenticatedUserId) {
        Optional<Item> item = itemRepository.findById(id);
        if (item.isEmpty()) {
            return DeleteResult.NOT_FOUND;
        }

        Item existing = item.get();
        boolean isItemOwner = existing.getUser().getId().equals(authenticatedUserId);
        boolean isEventOwner = existing.getEvent().getOwner() != null
                && existing.getEvent().getOwner().getId().equals(authenticatedUserId);
        if (!isItemOwner && !isEventOwner) {
            return DeleteResult.FORBIDDEN;
        }

        itemRepository.delete(existing);
        return DeleteResult.DELETED;
    }

    // -------------------- MAPPING --------------------
    private ItemResponse mapToResponse(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getName(),
                item.getQuantity(),
                item.getEvent() != null ? item.getEvent().getId() : null,
                item.getUser() != null ? item.getUser().getId() : null,
                item.getUser() != null ? item.getUser().getName() : null
        );
    }

    public enum DeleteResult {
        DELETED,
        NOT_FOUND,
        FORBIDDEN
    }

    public static class ItemAuthorizationException extends RuntimeException {
    }
}
