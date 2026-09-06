package com.example.eventlife.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for deleting a user by username and password")
public class DeleteUserRequest {

    @Schema(description = "Deprecated compatibility field; ignored. The account comes from the Bearer token.", example = "user1234")
    private String username;

    @Schema(description = "Password of the user for verification", example = "mySecretPassword123", required = true)
    private String password;

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
