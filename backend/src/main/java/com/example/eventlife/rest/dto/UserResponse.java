package com.example.eventlife.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object representing a user")
public class UserResponse {

    @Schema(description = "Unique ID of the user", example = "1")
    private Long id;

    @Schema(description = "Username of the user", example = "user1234")
    private String username;

    @Schema(description = "Email address of the user", example = "user@mail.com")
    private String email;

    @Schema(description = "Full name of the user", example = "Uriel Dahan")
    private String name;

    @Schema(description = "Phone number of the user", example = "0501234567")
    private String phone;

    public UserResponse() {}

    public UserResponse(Long id, String username, String email, String name, String phone) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.phone = phone;
    }

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
}