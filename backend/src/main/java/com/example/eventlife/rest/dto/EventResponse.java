package com.example.eventlife.rest.dto;

import com.example.eventlife.enums.EventType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Response object representing an event")
public class EventResponse {

    @Schema(description = "Unique ID of the event", example = "7")
    private Long id;

    @Schema(description = "Name of the event", example = "Birthday Party")
    private String name;

    @Schema(description = "Description of the event", example = "Celebrating John's 30th birthday")
    private String description;

    @Schema(description = "Location of the event", example = "Tel Aviv, Israel")
    private String location;

    @Schema(description = "Date and time of the event (ISO 8601 format)", example = "2025-10-12T20:00:00")
    private LocalDateTime date;

    @Schema(description = "Type of the event", example = "BIRTHDAY")
    private EventType eventType;

    @Schema(description = "Maximum number of participants allowed", example = "20")
    private Integer maxParticipants;

    @Schema(description = "ID of the user who created the event", example = "1")
    private Long ownerId;

    @Schema(description = "Username of the event owner", example = "urieldahan")
    private String ownerUsername;

    @Schema(description = "List of usernames of participants", example = "[\"noa123\", \"david90\"]")
    private List<String> participants;

    public EventResponse() {}

    public EventResponse(Long id, String name, String description, String location,
                         LocalDateTime date, EventType eventType, Integer maxParticipants,
                         Long ownerId, String ownerUsername, List<String> participants) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.date = date;
        this.eventType = eventType;
        this.maxParticipants = maxParticipants;
        this.ownerId = ownerId;
        this.ownerUsername = ownerUsername;
        this.participants = participants;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public List<String> getParticipants() { return participants; }
    public void setParticipants(List<String> participants) { this.participants = participants; }
}