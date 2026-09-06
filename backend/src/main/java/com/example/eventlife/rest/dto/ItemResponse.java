package com.example.eventlife.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object representing an item in an event")
public class ItemResponse {

    @Schema(description = "Unique ID of the item", example = "1")
    private Long id;

    @Schema(description = "Item name", example = "Pizza")
    private String name;

    @Schema(description = "Quantity of the item", example = "3")
    private int quantity;

    @Schema(description = "ID of the related event", example = "10")
    private Long eventId;

    @Schema(description = "ID of the user bringing the item", example = "5")
    private Long userId;

    @Schema(description = "Name of the user bringing the item", example = "Uriel Dahan")
    private String userName;

    public ItemResponse(Long id, String name, int quantity, Long eventId, Long userId, String userName) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.eventId = eventId;
        this.userId = userId;
        this.userName = userName;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public Long getEventId() {
        return eventId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }
}