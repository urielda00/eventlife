package com.example.eventlife.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for registering a new user")
public class RegisterRequest {

    @Schema(description = "Unique username for the new user", example = "user1234", required = true)
    private String username;

    @Schema(description = "Password for the new user", example = "mySecretPassword123", required = true)
    private String password;

    @Schema(description = "Email address of the user", example = "user@mail.com", required = true)
    private String email;

    @Schema(description = "Full name of the user", example = "Uriel Dahan", required = true)
    private String name;

    @Schema(description = "Phone number of the user", example = "0501234567", required = true)
    private String phone;

    public RegisterRequest() {}

    public RegisterRequest(String username, String password, String email, String name, String phone) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.phone = phone;
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
}