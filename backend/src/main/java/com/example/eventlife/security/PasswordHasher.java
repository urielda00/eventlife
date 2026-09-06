package com.example.eventlife.security;

import org.springframework.security.crypto.bcrypt.BCrypt;

public class PasswordHasher {

    public static String hash(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public static boolean check(String rawPassword, String hashedPassword) {
        return BCrypt.checkpw(rawPassword, hashedPassword);
    }
}