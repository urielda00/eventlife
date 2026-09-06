package com.example.eventlife;

import com.example.eventlife.enums.EventType;
import com.example.eventlife.model.Event;
import com.example.eventlife.model.Item;
import com.example.eventlife.model.User;
import com.example.eventlife.repository.EventRepository;
import com.example.eventlife.repository.ItemRepository;
import com.example.eventlife.repository.UserRepository;
import com.example.eventlife.rest.dto.CreateEventRequest;
import com.example.eventlife.rest.dto.EventResponse;
import com.example.eventlife.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

abstract class DatabaseBaselineContract {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private EventService eventService;

    @BeforeEach
    void clearApplicationTables() {
        itemRepository.deleteAllInBatch();
        eventRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
    }

    @Test
    void flywayCreatesExpectedApplicationSchemaBeforeJpaValidation() {
        List<String> tables = jdbcTemplate.queryForList("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_name IN ('users', 'events', 'items')
                ORDER BY table_name
                """, String.class);

        assertThat(tables).containsExactly("events", "items", "users");

        Integer migrationCount = jdbcTemplate.queryForObject("""
                SELECT COUNT(*)
                FROM flyway_schema_history
                WHERE version = '1' AND success
                """, Integer.class);
        assertThat(migrationCount).isEqualTo(1);

        Set<String> indexes = Set.copyOf(jdbcTemplate.queryForList("""
                SELECT indexname
                FROM pg_indexes
                WHERE schemaname = 'public'
                """, String.class));
        assertThat(indexes).contains(
                "uk_users_username",
                "idx_events_owner_id",
                "idx_items_event_id",
                "idx_items_user_id"
        );
    }

    @Test
    void repositoriesPersistRelationshipsAndPostgresArrays() {
        User owner = new User();
        owner.setUsername("owner");
        owner.setPassword("hashed-password");
        owner.setName("Event Owner");
        owner = userRepository.save(owner);

        User participant = new User();
        participant.setUsername("participant");
        participant.setPassword("hashed-password");
        participant.setName("Event Participant");
        participant = userRepository.save(participant);

        Event event = new Event();
        event.setName("Baseline event");
        event.setDate(LocalDateTime.of(2026, 9, 6, 18, 0));
        event.setEventType(EventType.PRIVATE_PARTY);
        event.setMaxParticipants(10);
        event.setOwner(owner);
        event = eventRepository.save(event);

        userRepository.addCreatedEvent(owner.getId(), event.getId());
        userRepository.addJoinedEvent(participant.getId(), event.getId());
        eventRepository.addParticipant(event.getId(), participant.getUsername());

        Item item = itemRepository.save(new Item("Drinks", 2, event, participant));

        User reloadedOwner = userRepository.findById(owner.getId()).orElseThrow();
        User reloadedParticipant = userRepository.findByUsername("participant").orElseThrow();
        Event reloadedEvent = eventRepository.findById(event.getId()).orElseThrow();

        assertThat(reloadedOwner.getEventCreated()).containsExactly(event.getId().toString());
        assertThat(reloadedOwner.getTotalEventsCreated()).isEqualTo(1);
        assertThat(reloadedParticipant.getEventJoined()).containsExactly(event.getId().toString());
        assertThat(reloadedParticipant.getTotalEventsJoined()).isEqualTo(1);
        assertThat(reloadedEvent.getParticipants()).containsExactly("participant");
        assertThat(reloadedEvent.getTotalParticipants()).isEqualTo(1);
        assertThat(itemRepository.findByEventIdAndUserId(event.getId(), participant.getId()))
                .extracting(Item::getId)
                .containsExactly(item.getId());
    }

    @Test
    void transactionalEventMutationsKeepBothSidesConsistentAndRollbackPartialFailure() {
        User owner = new User();
        owner.setUsername("transaction-owner");
        owner.setPassword("hashed-password");
        owner = userRepository.save(owner);

        User participant = new User();
        participant.setUsername("transaction-participant");
        participant.setPassword("hashed-password");
        participant = userRepository.save(participant);

        CreateEventRequest request = new CreateEventRequest();
        request.setName("Transactional event");
        request.setEventType(EventType.PUBLIC_PARTY);
        request.setMaxParticipants(5);
        request.setOwnerId(participant.getId());
        request.setParticipants(List.of("spoofed-user"));

        EventResponse created = eventService.createEvent(request, owner.getId());
        User reloadedOwner = userRepository.findById(owner.getId()).orElseThrow();
        Event reloadedEvent = eventRepository.findById(created.getId()).orElseThrow();
        assertThat(reloadedEvent.getOwner().getId()).isEqualTo(owner.getId());
        assertThat(reloadedEvent.getParticipants()).isEmpty();
        assertThat(reloadedOwner.getEventCreated()).containsExactly(created.getId().toString());

        eventService.addParticipant(created.getId(), participant.getId(), participant.getUsername());
        User joinedUser = userRepository.findById(participant.getId()).orElseThrow();
        Event joinedEvent = eventRepository.findById(created.getId()).orElseThrow();
        assertThat(joinedEvent.getParticipants()).containsExactly(participant.getUsername());
        assertThat(joinedEvent.getTotalParticipants()).isEqualTo(1);
        assertThat(joinedUser.getEventJoined()).containsExactly(created.getId().toString());
        assertThat(joinedUser.getTotalEventsJoined()).isEqualTo(1);

        org.assertj.core.api.Assertions.assertThatThrownBy(() ->
                        eventService.addParticipant(created.getId(), Long.MAX_VALUE, "ghost-user"))
                .isInstanceOf(EventService.MutationException.class);
        Event afterRollback = eventRepository.findById(created.getId()).orElseThrow();
        assertThat(afterRollback.getParticipants()).containsExactly(participant.getUsername());
        assertThat(afterRollback.getTotalParticipants()).isEqualTo(1);

        eventService.removeParticipant(created.getId(), participant.getId(), participant.getUsername());
        User leftUser = userRepository.findById(participant.getId()).orElseThrow();
        Event leftEvent = eventRepository.findById(created.getId()).orElseThrow();
        assertThat(leftEvent.getParticipants()).isEmpty();
        assertThat(leftEvent.getTotalParticipants()).isZero();
        assertThat(leftUser.getEventJoined()).isEmpty();
        assertThat(leftUser.getTotalEventsJoined()).isZero();
    }
}

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
class DatabaseBaselineIntegrationTests extends DatabaseBaselineContract {

    @Container
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:17-alpine")
                    .withDatabaseName("eventlife")
                    .withUsername("eventlife_app")
                    .withPassword("test-password");

    @DynamicPropertySource
    static void configureDatabase(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.jpa.show-sql", () -> "false");
    }
}

@SpringBootTest
@EnabledIfEnvironmentVariable(named = "EVENTLIFE_TEST_DATABASE_URL", matches = ".+")
class ExternalDatabaseBaselineIntegrationTests extends DatabaseBaselineContract {

    @DynamicPropertySource
    static void configureDatabase(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> System.getenv("EVENTLIFE_TEST_DATABASE_URL"));
        registry.add("spring.datasource.username", () -> System.getenv("EVENTLIFE_TEST_DATABASE_USERNAME"));
        registry.add("spring.datasource.password", () -> System.getenv("EVENTLIFE_TEST_DATABASE_PASSWORD"));
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.jpa.show-sql", () -> "false");
    }
}
