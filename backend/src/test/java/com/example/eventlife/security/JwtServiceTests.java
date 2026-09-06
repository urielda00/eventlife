package com.example.eventlife.security;

import com.auth0.jwt.JWT;
import com.example.eventlife.model.User;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTests {

    private static final String SECRET = "test-signing-secret-that-is-at-least-32-bytes";

    @Test
    void generatedTokenIsAStandardHs256JwtWithSubjectAndExpiration() {
        JwtService jwtService = new JwtService(SECRET, 600_000, Clock.systemUTC());
        User user = user(1L, "alice");

        String token = jwtService.generateToken(user);

        assertThat(token.split("\\.")).hasSize(3);
        assertThat(JWT.decode(token).getAlgorithm()).isEqualTo("HS256");
        assertThat(JWT.decode(token).getSubject()).isEqualTo("alice");
        assertThat(JWT.decode(token).getExpiresAtAsInstant()).isAfter(Instant.now());
        assertThat(jwtService.validateAndExtractSubject(token)).isEqualTo("alice");
    }

    @Test
    void malformedAndWrongSignatureTokensAreRejected() {
        JwtService jwtService = new JwtService(SECRET, 600_000, Clock.systemUTC());
        JwtService otherSigner = new JwtService("different-signing-secret-that-is-at-least-32-bytes", 600_000,
                Clock.systemUTC());

        assertThat(jwtService.validateToken("not-a-jwt")).isFalse();
        assertThat(jwtService.validateToken(otherSigner.generateToken(user(1L, "alice")))).isFalse();
    }

    @Test
    void expiredTokenIsRejected() {
        Clock expiredClock = Clock.fixed(Instant.now().minusSeconds(120), ZoneOffset.UTC);
        JwtService jwtService = new JwtService(SECRET, 1_000, expiredClock);

        assertThat(jwtService.validateToken(jwtService.generateToken(user(1L, "alice")))).isFalse();
    }

    private User user(Long id, String username) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        return user;
    }
}
