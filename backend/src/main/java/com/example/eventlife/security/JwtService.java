package com.example.eventlife.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.eventlife.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;

@Service
public class JwtService {

    private static final String ISSUER = "eventlife";

    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final long expirationMillis;
    private final Clock clock;

    @Autowired
    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expirationMillis) {
        this(secret, expirationMillis, Clock.systemUTC());
    }

    JwtService(String secret, long expirationMillis, Clock clock) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException("APP_JWT_SECRET must contain at least 32 bytes");
        }
        if (expirationMillis <= 0) {
            throw new IllegalArgumentException("APP_JWT_EXPIRATION must be a positive millisecond value");
        }

        this.algorithm = Algorithm.HMAC256(secret);
        this.verifier = JWT.require(algorithm).withIssuer(ISSUER).build();
        this.expirationMillis = expirationMillis;
        this.clock = clock;
    }

    public String generateToken(User user) {
        Instant issuedAt = clock.instant();
        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(user.getUsername())
                .withIssuedAt(issuedAt)
                .withExpiresAt(issuedAt.plusMillis(expirationMillis))
                .sign(algorithm);
    }

    public String validateAndExtractSubject(String token) {
        DecodedJWT decoded = verifier.verify(token);
        String subject = decoded.getSubject();
        if (subject == null || subject.isBlank()) {
            throw new IllegalArgumentException("JWT subject is missing");
        }
        return subject;
    }

    public boolean validateToken(String token) {
        try {
            validateAndExtractSubject(token);
            return true;
        } catch (RuntimeException ex) {
            return false;
        }
    }
}
