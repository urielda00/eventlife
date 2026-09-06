package com.example.eventlife.rest.dto;

import com.example.eventlife.enums.EventType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Request object for creating a new event")
public class CreateEventRequest {

    @Schema(description = "Name of the event", example = "Birthday Party")
    private String name;

    @Schema(description = "Detailed description of the event", example = "Celebrating John's 30th birthday")
    private String description;

    @Schema(description = "Location of the event", example = "Tel Aviv, Israel")
    private String location;

    @Schema(description = "Date and time of the event (ISO 8601 format)", example = "2025-10-12T14:00:00")
    private LocalDateTime date;

    @Schema(description = "Type of the event", example = "BIRTHDAY")
    private EventType eventType;

    @Schema(description = "Maximum number of participants allowed", example = "20")
    private Integer maxParticipants;

    @Schema(description = "Deprecated compatibility field; ignored. Ownership comes from the Bearer token.", example = "1")
    private Long ownerId;

    @Schema(description = "Deprecated compatibility field; ignored on creation. Users join through the authenticated join endpoint.", example = "[\"noa123\", \"david90\"]")
    private List<String> participants;

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

    public List<String> getParticipants() { return participants; }
    public void setParticipants(List<String> participants) { this.participants = participants; }
}
