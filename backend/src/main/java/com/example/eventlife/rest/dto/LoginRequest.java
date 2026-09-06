package com.example.eventlife.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for user login")
public class LoginRequest {

    @Schema(description = "Username of the user", example = "user1234", required = true)
    private String username;

    @Schema(description = "Password of the user", example = "mySecretPassword123", required = true)
    private String password;

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
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
}