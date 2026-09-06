package com.example.eventlife;

import com.example.eventlife.config.CorsConfig;
import com.example.eventlife.config.SecurityConfig;
import com.example.eventlife.model.User;
import com.example.eventlife.repository.UserRepository;
import com.example.eventlife.rest.EventController;
import com.example.eventlife.rest.ItemController;
import com.example.eventlife.rest.UserController;
import com.example.eventlife.rest.dto.EventResponse;
import com.example.eventlife.rest.dto.ItemResponse;
import com.example.eventlife.rest.dto.UserResponse;
import com.example.eventlife.security.JwtAuthenticationFilter;
import com.example.eventlife.security.JwtService;
import com.example.eventlife.security.PasswordHasher;
import com.example.eventlife.security.RestAuthenticationEntryPoint;
import com.example.eventlife.service.EventService;
import com.example.eventlife.service.ItemService;
import com.example.eventlife.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = {UserController.class, EventController.class, ItemController.class},
        properties = {
                "app.jwt.secret=test-signing-secret-that-is-at-least-32-bytes",
                "app.jwt.expiration=600000",
                "app.cors.allowed-origins=https://allowed.example"
        })
@Import({SecurityConfig.class, CorsConfig.class, JwtAuthenticationFilter.class,
        RestAuthenticationEntryPoint.class, JwtService.class})
class SecurityMvcIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private UserService userService;

    @MockBean
    private EventService eventService;

    @MockBean
    private ItemService itemService;

    private User alice;
    private String aliceToken;

    @BeforeEach
    void setUpAuthentication() {
        alice = new User();
        alice.setId(1L);
        alice.setUsername("alice");
        alice.setPassword(PasswordHasher.hash("password"));
        aliceToken = jwtService.generateToken(alice);
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(alice));
    }

    @Test
    void loginReturnsAValidStandardJwt() throws Exception {
        when(userService.findByUsername("alice")).thenReturn(Optional.of(alice));

        String body = mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resBody.token").isString())
                .andReturn().getResponse().getContentAsString();

        JsonNode response = objectMapper.readTree(body);
        String token = response.at("/resBody/token").asText();
        assertThat(jwtService.validateAndExtractSubject(token)).isEqualTo("alice");
    }

    @Test
    void validJwtIsAcceptedAndMissingOrInvalidJwtIsRejected() throws Exception {
        when(userService.getUserByIdDto(1L))
                .thenReturn(Optional.of(new UserResponse(1L, "alice", "a@example.com", "Alice", "1")));

        mockMvc.perform(get("/api/users/1").header("Authorization", bearer(aliceToken)))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/users/1").header("Authorization", "Bearer malformed"))
                .andExpect(status().isUnauthorized());

        JwtService otherSigner = new JwtServiceForTest("different-signing-secret-that-is-at-least-32-bytes").service();
        mockMvc.perform(get("/api/users/1").header("Authorization", bearer(otherSigner.generateToken(alice))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticatedIdentityOverridesEventOwnerAndParticipantPayloads() throws Exception {
        EventResponse event = new EventResponse();
        event.setId(10L);
        when(eventService.createEvent(any(), eq(1L))).thenReturn(event);
        when(eventService.addParticipant(10L, 1L, "alice")).thenReturn(event);

        mockMvc.perform(post("/api/events")
                        .header("Authorization", bearer(aliceToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Secure\",\"ownerId\":999,\"participants\":[\"mallory\"]}"))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/events/10/join")
                        .header("Authorization", bearer(aliceToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"mallory\"}"))
                .andExpect(status().isOk());

        verify(eventService).createEvent(any(), eq(1L));
        verify(eventService).addParticipant(10L, 1L, "alice");
    }

    @Test
    void userCannotReadAnotherUsersPrivateData() throws Exception {
        mockMvc.perform(get("/api/users/2").header("Authorization", bearer(aliceToken)))
                .andExpect(status().isForbidden());

        verify(userService, never()).getUserByIdDto(2L);
    }

    @Test
    void eventOwnerRestrictionIsEnforced() throws Exception {
        when(eventService.deleteEvent(10L, 1L)).thenReturn(EventService.DeleteResult.FORBIDDEN);

        mockMvc.perform(delete("/api/events/10").header("Authorization", bearer(aliceToken)))
                .andExpect(status().isForbidden());
    }

    @Test
    void itemUserIdIsIgnoredAndDeleteAuthorizationIsEnforced() throws Exception {
        when(itemService.createItem(any(), eq(1L), eq("alice")))
                .thenReturn(Optional.of(new ItemResponse(2L, "Drinks", 1, 10L, 1L, "Alice")));
        when(itemService.deleteItem(2L, 1L)).thenReturn(ItemService.DeleteResult.FORBIDDEN);

        mockMvc.perform(post("/api/items")
                        .header("Authorization", bearer(aliceToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Drinks\",\"quantity\":1,\"eventId\":10,\"userId\":999}"))
                .andExpect(status().isCreated());
        mockMvc.perform(delete("/api/items/2").header("Authorization", bearer(aliceToken)))
                .andExpect(status().isForbidden());

        verify(itemService).createItem(any(), eq(1L), eq("alice"));
    }

    @Test
    void corsAllowsOnlyConfiguredOrigin() throws Exception {
        mockMvc.perform(options("/api/events")
                        .header("Origin", "https://allowed.example")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://allowed.example"));

        mockMvc.perform(options("/api/events")
                        .header("Origin", "https://blocked.example")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    @Test
    void publicEventReadsRemainAvailableWithoutAuthentication() throws Exception {
        when(eventService.getAllEvents()).thenReturn(List.of());
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk());
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private static class JwtServiceForTest {
        private final String secret;

        private JwtServiceForTest(String secret) {
            this.secret = secret;
        }

        private JwtService service() {
            return new JwtService(secret, 600_000);
        }
    }
}
