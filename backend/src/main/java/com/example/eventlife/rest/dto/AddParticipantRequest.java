package com.example.eventlife.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for adding or removing a participant from an event")
public class AddParticipantRequest {

    @Schema(description = "Deprecated compatibility field; ignored. The participant comes from the Bearer token.", example = "urieldahan")
    private String username;

    public AddParticipantRequest() {}

    public AddParticipantRequest(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
