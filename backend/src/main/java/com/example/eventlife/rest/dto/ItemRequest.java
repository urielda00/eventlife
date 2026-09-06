package com.example.eventlife.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for creating or updating an item")
public class ItemRequest {

    @Schema(description = "Item name (what the user will bring)", example = "Pizza")
    private String name;

    @Schema(description = "Quantity of the item", example = "3")
    private int quantity;

    @Schema(description = "The ID of the event this item belongs to", example = "1")
    private Long eventId;

    @Schema(description = "Deprecated compatibility field; ignored. The item owner comes from the Bearer token.", example = "5")
    private Long userId;

    public ItemRequest() {
    }

    public ItemRequest(String name, int quantity, Long eventId, Long userId) {
        this.name = name;
        this.quantity = quantity;
        this.eventId = eventId;
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
