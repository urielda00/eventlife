package com.example.eventlife.rest;

import com.example.eventlife.rest.dto.BaseResponse;
import com.example.eventlife.rest.dto.CreateEventRequest;
import com.example.eventlife.rest.dto.EventResponse;
import com.example.eventlife.rest.dto.AddParticipantRequest;
import com.example.eventlife.service.EventService;
import com.example.eventlife.security.AuthenticatedUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // -------------------- CREATE EVENT --------------------
    @PostMapping
    public ResponseEntity<BaseResponse> createEvent(@RequestBody CreateEventRequest request,
                                                    @AuthenticationPrincipal AuthenticatedUser principal) {
        try {
            EventResponse created = eventService.createEvent(request, principal.id());

            return ResponseEntity.status(HttpStatus.CREATED)
                                 .body(new BaseResponse(true, "Event created successfully", created, HttpStatus.CREATED.value()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- GET ALL EVENTS --------------------
    @GetMapping
    public ResponseEntity<BaseResponse> getAllEvents() {
        try {
            List<EventResponse> events = eventService.getAllEvents();
            return ResponseEntity.ok(new BaseResponse(true, "Events retrieved successfully", events, HttpStatus.OK.value()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- GET EVENTS PAGED --------------------
    @GetMapping("/paged")
    public ResponseEntity<BaseResponse> getEventsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<EventResponse> events = eventService.getEventsPaged(page, size);
            return ResponseEntity.ok(new BaseResponse(true, "Events retrieved successfully (paged)", events, HttpStatus.OK.value()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- GET EVENT BY ID --------------------
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getEventById(@PathVariable Long id) {
        try {
            Optional<EventResponse> event = eventService.getEventById(id);
            if (event.isPresent()) {
                return ResponseEntity.ok(new BaseResponse(true, "Event found", event.get(), HttpStatus.OK.value()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(new BaseResponse(false, "Event not found", null, HttpStatus.NOT_FOUND.value()));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- DELETE EVENT --------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deleteEvent(@PathVariable Long id,
                                                    @AuthenticationPrincipal AuthenticatedUser principal) {
        try {
            EventService.DeleteResult result = eventService.deleteEvent(id, principal.id());
            if (result == EventService.DeleteResult.DELETED) {
                return ResponseEntity.ok(new BaseResponse(true, "Event deleted successfully", null, HttpStatus.OK.value()));
            }
            if (result == EventService.DeleteResult.FORBIDDEN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new BaseResponse(false, "Only the event owner may delete this event", null,
                                HttpStatus.FORBIDDEN.value()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(new BaseResponse(false, "Event not found", null, HttpStatus.NOT_FOUND.value()));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- JOIN EVENT --------------------
    @PostMapping("/{id}/join")
    public ResponseEntity<BaseResponse> joinEvent(@PathVariable Long id,
                                                  @RequestBody(required = false) AddParticipantRequest request,
                                                  @AuthenticationPrincipal AuthenticatedUser principal) {
        try {
            EventResponse event = eventService.addParticipant(id, principal.id(), principal.username());
            return ResponseEntity.ok(new BaseResponse(true, "Joined event", event, HttpStatus.OK.value()));
        } catch (EventService.MutationException ex) {
            return mutationFailure(ex);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- LEAVE EVENT --------------------
    @PostMapping("/{id}/leave")
    public ResponseEntity<BaseResponse> leaveEvent(@PathVariable Long id,
                                                   @RequestBody(required = false) AddParticipantRequest request,
                                                   @AuthenticationPrincipal AuthenticatedUser principal) {
        try {
            EventResponse event = eventService.removeParticipant(id, principal.id(), principal.username());
            return ResponseEntity.ok(new BaseResponse(true, "Left event", event, HttpStatus.OK.value()));
        } catch (EventService.MutationException ex) {
            return mutationFailure(ex);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    private ResponseEntity<BaseResponse> mutationFailure(EventService.MutationException ex) {
        if (ex.getFailure() == EventService.MutationFailure.EVENT_NOT_FOUND) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse(false, "Event not found", null, HttpStatus.NOT_FOUND.value()));
        }
        if (ex.getFailure() == EventService.MutationFailure.EVENT_FULL) {
            return ResponseEntity.badRequest()
                    .body(new BaseResponse(false, "Event is full", null, HttpStatus.BAD_REQUEST.value()));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new BaseResponse(false, "Event mutation could not be completed", null,
                        HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}
