package com.example.eventlife.rest;

import com.example.eventlife.model.User;
import com.example.eventlife.rest.dto.*;
import com.example.eventlife.security.JwtService;
import com.example.eventlife.security.AuthenticatedUser;
import com.example.eventlife.security.PasswordHasher;
import com.example.eventlife.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // -------------------- REGISTER --------------------
    @PostMapping("/register")
    public ResponseEntity<BaseResponse> register(@RequestBody RegisterRequest request) {
        try {
            Optional<UserResponse> created = userService.register(request);
            if (created.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                     .body(new BaseResponse(false, "Username or email already exists", null, HttpStatus.CONFLICT.value()));
            }

            User userEntity = userService.getUserById(created.get().getId()).orElseThrow();
            String token = jwtService.generateToken(userEntity);

            Map<String, Object> data = Map.of(
                    "token", token,
                    "user", created.get()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                                 .body(new BaseResponse(true, "User registered successfully", data, HttpStatus.CREATED.value()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- LOGIN --------------------
    @PostMapping("/login")
    public ResponseEntity<BaseResponse> login(@RequestBody LoginRequest request) {
        try {
            Optional<User> optionalUser = userService.findByUsername(request.getUsername());

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                if (PasswordHasher.check(request.getPassword(), user.getPassword())) {
                    String token = jwtService.generateToken(user);
                    UserResponse userResponse = new UserResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getName(),
                            user.getPhone()
                    );

                    Map<String, Object> data = Map.of(
                            "token", token,
                            "user", userResponse
                    );

                    return ResponseEntity.ok(new BaseResponse(true, "Login successful", data, HttpStatus.OK.value()));
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(new BaseResponse(false, "Invalid credentials", null, HttpStatus.UNAUTHORIZED.value()));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- GET ALL USERS --------------------
    @GetMapping
    public ResponseEntity<BaseResponse> getAllUsers() {
        try {
            List<UserResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(new BaseResponse(true, "Users retrieved successfully", users, HttpStatus.OK.value()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- GET USER BY ID --------------------
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getUserById(@PathVariable Long id,
                                                    @AuthenticationPrincipal AuthenticatedUser principal) {
        if (!principal.id().equals(id)) {
            return forbidden();
        }
        try {
            Optional<UserResponse> user = userService.getUserByIdDto(id);
            if (user.isPresent()) {
                return ResponseEntity.ok(new BaseResponse(true, "User found", user.get(), HttpStatus.OK.value()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(new BaseResponse(false, "User not found", null, HttpStatus.NOT_FOUND.value()));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- DELETE USER --------------------
    @DeleteMapping
    public ResponseEntity<BaseResponse> deleteUser(@RequestBody DeleteUserRequest request,
                                                   @AuthenticationPrincipal AuthenticatedUser principal) {
        try {
            Optional<User> optionalUser = userService.getUserById(principal.id());
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                if (PasswordHasher.check(request.getPassword(), user.getPassword())) {
                    userService.deleteUser(user.getId());
                    return ResponseEntity.ok(new BaseResponse(true, "User deleted successfully", null, HttpStatus.OK.value()));
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(new BaseResponse(false, "Invalid username or password", null, HttpStatus.UNAUTHORIZED.value()));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- GET CREATED EVENTS --------------------
    @GetMapping("/{id}/created-events")
    public ResponseEntity<BaseResponse> getCreatedEvents(@PathVariable Long id,
                                                         @AuthenticationPrincipal AuthenticatedUser principal) {
        if (!principal.id().equals(id)) {
            return forbidden();
        }
        try {
            List<EventResponse> events = userService.getCreatedEvents(id);
            return ResponseEntity.ok(new BaseResponse(true, "Created events retrieved successfully", events, HttpStatus.OK.value()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    // -------------------- GET JOINED EVENTS --------------------
    @GetMapping("/{id}/joined-events")
    public ResponseEntity<BaseResponse> getJoinedEvents(@PathVariable Long id,
                                                        @AuthenticationPrincipal AuthenticatedUser principal) {
        if (!principal.id().equals(id)) {
            return forbidden();
        }
        try {
            List<EventResponse> events = userService.getJoinedEvents(id);
            return ResponseEntity.ok(new BaseResponse(true, "Joined events retrieved successfully", events, HttpStatus.OK.value()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new BaseResponse(false, "Internal Server Error", null, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    private ResponseEntity<BaseResponse> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new BaseResponse(false, "You may only access your own account", null,
                        HttpStatus.FORBIDDEN.value()));
    }
}
