package com.example.eventlife.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.eventlife.model.User;
import com.example.eventlife.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AuthenticationEntryPoint authenticationEntryPoint;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository,
                                   RestAuthenticationEntryPoint authenticationEntryPoint) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!authorization.startsWith(BEARER_PREFIX) || authorization.length() == BEARER_PREFIX.length()) {
            reject(request, response, "Malformed bearer token");
            return;
        }

        try {
            String subject = jwtService.validateAndExtractSubject(authorization.substring(BEARER_PREFIX.length()));
            User user = userRepository.findByUsername(subject)
                    .orElseThrow(() -> new BadCredentialsException("Token user no longer exists"));

            AuthenticatedUser principal = new AuthenticatedUser(user.getId(), user.getUsername());
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, List.of());
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            filterChain.doFilter(request, response);
        } catch (JWTVerificationException | IllegalArgumentException | BadCredentialsException ex) {
            SecurityContextHolder.clearContext();
            reject(request, response, "Invalid or expired bearer token");
        }
    }

    private void reject(HttpServletRequest request, HttpServletResponse response, String message)
            throws IOException, ServletException {
        authenticationEntryPoint.commence(request, response, new BadCredentialsException(message));
    }
}
