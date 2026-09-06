package com.example.eventlife.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String email;
    private String name;
    private String phone;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "event_created", nullable = false, columnDefinition = "text[]")
    private String[] eventCreated = new String[]{};

    @Column(name = "total_events_created", nullable = false)
    private int totalEventsCreated = 0;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "event_joined", nullable = false, columnDefinition = "text[]")
    private String[] eventJoined = new String[]{};

    @Column(name = "total_events_joined", nullable = false)
    private int totalEventsJoined = 0;

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String[] getEventCreated() {
        return eventCreated;
    }

    public void setEventCreated(String[] eventCreated) {
        this.eventCreated = eventCreated;
    }

    public int getTotalEventsCreated() {
        return totalEventsCreated;
    }

    public void setTotalEventsCreated(int totalEventsCreated) {
        this.totalEventsCreated = totalEventsCreated;
    }

    public String[] getEventJoined() {
        return eventJoined;
    }

    public void setEventJoined(String[] eventJoined) {
        this.eventJoined = eventJoined;
    }

    public int getTotalEventsJoined() {
        return totalEventsJoined;
    }

    public void setTotalEventsJoined(int totalEventsJoined) {
        this.totalEventsJoined = totalEventsJoined;
    }
}
