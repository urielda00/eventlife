package com.example.eventlife.model;

import com.example.eventlife.enums.EventType;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String location;
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private EventType eventType;

    private Integer maxParticipants;

    @Column(name = "total_participants", nullable = false)
    private Integer totalParticipants = 0;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "participants", nullable = false, columnDefinition = "text[]")
    private String[] participants = new String[]{};

    // Getters & Setters
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

    public Integer getTotalParticipants() { return totalParticipants; }
    public void setTotalParticipants(Integer totalParticipants) { this.totalParticipants = totalParticipants; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String[] getParticipants() { return participants; }
    public void setParticipants(String[] participants) { this.participants = participants; }
}
