package com.example.eventlife.rest;

import com.example.eventlife.rest.dto.BaseResponse;
import com.example.eventlife.rest.dto.ItemRequest;
import com.example.eventlife.rest.dto.ItemResponse;
import com.example.eventlife.service.ItemService;
import com.example.eventlife.security.AuthenticatedUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    // -------------------- CREATE ITEM --------------------
    @Operation(summary = "Create a new item for an event by a user")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Item created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": true,\n" +
                                    "  \"message\": \"Item created successfully\",\n" +
                                    "  \"resBody\": {\n" +
                                    "    \"id\": 1,\n" +
                                    "    \"name\": \"Pizza\",\n" +
                                    "    \"quantity\": 3,\n" +
                                    "    \"eventId\": 7,\n" +
                                    "    \"userId\": 1,\n" +
                                    "    \"userName\": \"Uriel Dahan\"\n" +
                                    "  },\n" +
                                    "  \"status\": 201\n" +
                                    "}")
                    )),
            @ApiResponse(responseCode = "400", description = "Invalid event or user ID",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": false,\n" +
                                    "  \"message\": \"Invalid event or user ID\",\n" +
                                    "  \"resBody\": null,\n" +
                                    "  \"status\": 400\n" +
                                    "}")
                    )),
            @ApiResponse(responseCode = "500", description = "Internal Server Error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": false,\n" +
                                    "  \"message\": \"Internal Server Error\",\n" +
                                    "  \"resBody\": null,\n" +
                                    "  \"status\": 500\n" +
                                    "}")
                    ))
    })
    @PostMapping
    public ResponseEntity<BaseResponse> createItem(@RequestBody ItemRequest request,
                                                   @AuthenticationPrincipal AuthenticatedUser principal) {
        try {
            Optional<ItemResponse> created = itemService.createItem(request, principal.id(), principal.username());
            if (created.isEmpty()) {
                BaseResponse response = new BaseResponse(false, "Invalid event or user ID", null, HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(response);
            }
            BaseResponse response = new BaseResponse(true, "Item created successfully", created.get(), HttpStatus.CREATED.value());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ItemService.ItemAuthorizationException e) {
            BaseResponse response = new BaseResponse(false, "Join the event before adding an item", null,
                    HttpStatus.FORBIDDEN.value());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (Exception e) {
            BaseResponse response = new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // -------------------- GET ALL ITEMS --------------------
    @Operation(summary = "Get all items", description = "Returns all items from all events")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of all items",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": true,\n" +
                                    "  \"message\": \"Items retrieved successfully\",\n" +
                                    "  \"resBody\": [\n" +
                                    "    {\"id\": 1, \"name\": \"Pizza\", \"quantity\": 3, \"eventId\": 7, \"userId\": 1, \"userName\": \"Uriel Dahan\"},\n" +
                                    "    {\"id\": 2, \"name\": \"Cola\", \"quantity\": 6, \"eventId\": 7, \"userId\": 2, \"userName\": \"Noa Levi\"}\n" +
                                    "  ],\n" +
                                    "  \"status\": 200\n" +
                                    "}")
                    ))
    })
    @GetMapping
    public ResponseEntity<BaseResponse> getAllItems() {
        try {
            List<ItemResponse> items = itemService.getAllItems();
            BaseResponse response = new BaseResponse(true, "Items retrieved successfully", items, HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse response = new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // -------------------- GET ITEM BY ID --------------------
    @Operation(summary = "Get item by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": true,\n" +
                                    "  \"message\": \"Item found\",\n" +
                                    "  \"resBody\": {\"id\": 1, \"name\": \"Pizza\", \"quantity\": 3, \"eventId\": 7, \"userId\": 1, \"userName\": \"Uriel Dahan\"},\n" +
                                    "  \"status\": 200\n" +
                                    "}")
                    )),
            @ApiResponse(responseCode = "404", description = "Item not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": false,\n" +
                                    "  \"message\": \"Item not found\",\n" +
                                    "  \"resBody\": null,\n" +
                                    "  \"status\": 404\n" +
                                    "}")
                    ))
    })
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getItemById(@PathVariable Long id) {
        try {
            Optional<ItemResponse> item = itemService.getItemById(id);
            if (item.isPresent()) {
                BaseResponse response = new BaseResponse(true, "Item found", item.get(), HttpStatus.OK.value());
                return ResponseEntity.ok(response);
            }
            BaseResponse response = new BaseResponse(false, "Item not found", null, HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            BaseResponse response = new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // -------------------- GET ITEMS BY EVENT --------------------
    @Operation(summary = "Get all items for a specific event")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Items for the event retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": true,\n" +
                                    "  \"message\": \"Items for event retrieved successfully\",\n" +
                                    "  \"resBody\": [\n" +
                                    "    {\"id\": 1, \"name\": \"Pizza\", \"quantity\": 3, \"eventId\": 7, \"userId\": 1, \"userName\": \"Uriel Dahan\"},\n" +
                                    "    {\"id\": 2, \"name\": \"Cola\", \"quantity\": 6, \"eventId\": 7, \"userId\": 2, \"userName\": \"Noa Levi\"}\n" +
                                    "  ],\n" +
                                    "  \"status\": 200\n" +
                                    "}")
                    )),
            @ApiResponse(responseCode = "500", description = "Internal Server Error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": false,\n" +
                                    "  \"message\": \"Internal Server Error\",\n" +
                                    "  \"resBody\": null,\n" +
                                    "  \"status\": 500\n" +
                                    "}")
                    ))
    })
    @GetMapping("/event/{eventId}")
    public ResponseEntity<BaseResponse> getItemsByEvent(@PathVariable Long eventId) {
        try {
            List<ItemResponse> items = itemService.getItemsByEvent(eventId);
            BaseResponse response = new BaseResponse(true, "Items for event retrieved successfully", items, HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse response = new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // -------------------- GET ITEMS BY USER --------------------
    @Operation(summary = "Get all items for a specific user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Items for the user retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": true,\n" +
                                    "  \"message\": \"Items for user retrieved successfully\",\n" +
                                    "  \"resBody\": [\n" +
                                    "    {\"id\": 3, \"name\": \"Salad\", \"quantity\": 2, \"eventId\": 7, \"userId\": 3, \"userName\": \"Dana Cohen\"}\n" +
                                    "  ],\n" +
                                    "  \"status\": 200\n" +
                                    "}")
                    )),
            @ApiResponse(responseCode = "500", description = "Internal Server Error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": false,\n" +
                                    "  \"message\": \"Internal Server Error\",\n" +
                                    "  \"resBody\": null,\n" +
                                    "  \"status\": 500\n" +
                                    "}")
                    ))
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<BaseResponse> getItemsByUser(@PathVariable Long userId,
                                                       @AuthenticationPrincipal AuthenticatedUser principal) {
        if (!principal.id().equals(userId)) {
            BaseResponse response = new BaseResponse(false, "You may only access your own items", null,
                    HttpStatus.FORBIDDEN.value());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        try {
            List<ItemResponse> items = itemService.getItemsByUser(userId);
            BaseResponse response = new BaseResponse(true, "Items for user retrieved successfully", items, HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse response = new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // -------------------- DELETE ITEM --------------------
    @Operation(summary = "Delete an item by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Item deleted successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": true,\n" +
                                    "  \"message\": \"Item deleted successfully\",\n" +
                                    "  \"resBody\": null,\n" +
                                    "  \"status\": 204\n" +
                                    "}")
                    )),
            @ApiResponse(responseCode = "404", description = "Item not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": false,\n" +
                                    "  \"message\": \"Item not found\",\n" +
                                    "  \"resBody\": null,\n" +
                                    "  \"status\": 404\n" +
                                    "}")
                    )),
            @ApiResponse(responseCode = "500", description = "Internal Server Error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BaseResponse.class),
                            examples = @ExampleObject(value = "{\n" +
                                    "  \"success\": false,\n" +
                                    "  \"message\": \"Internal Server Error\",\n" +
                                    "  \"resBody\": null,\n" +
                                    "  \"status\": 500\n" +
                                    "}")
                    ))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deleteItem(@PathVariable Long id,
                                                   @AuthenticationPrincipal AuthenticatedUser principal) {
        try {
            ItemService.DeleteResult result = itemService.deleteItem(id, principal.id());
            if (result == ItemService.DeleteResult.NOT_FOUND) {
                BaseResponse response = new BaseResponse(false, "Item not found", null, HttpStatus.NOT_FOUND.value());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            if (result == ItemService.DeleteResult.FORBIDDEN) {
                BaseResponse response = new BaseResponse(false, "Only the item or event owner may delete this item", null,
                        HttpStatus.FORBIDDEN.value());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            BaseResponse response = new BaseResponse(true, "Item deleted successfully", null, HttpStatus.NO_CONTENT.value());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        } catch (Exception e) {
            BaseResponse response = new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
