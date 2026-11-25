package com.ai.smartrecruit.Security;

import com.ai.smartrecruit.Model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "mysecretkey_secret_2026_smartrecruit_project_123456789";

    // Create signing key
    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET_KEY.getBytes(StandardCharsets.UTF_8)
            );

    // =========================
    // GENERATE JWT TOKEN
    // =========================
    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole())
                .claim("name", user.getName())
                .claim("id", user.getId())
                .issuedAt(new Date())
                // Token valid for 1 hour
                .expiration(
                        new Date(System.currentTimeMillis() + 60 * 60 * 1000)
                )
                .signWith(key)
                .compact();
    }

    // =========================
    // EXTRACT EMAIL
    // =========================
    public String extractEmail(String token) {

        return extractAllClaims(token).getSubject();
    }

    // =========================
    // EXTRACT ALL CLAIMS
    // =========================
    public Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================
//    public boolean isTokenValid(String token) {
//
//        try {
//
//            Claims claims = extractAllClaims(token);
//
//            boolean notExpired =
//                    claims.getExpiration().after(new Date());
//
//            System.out.println("=================================");
//            System.out.println("TOKEN EMAIL: " + claims.getSubject());
//            System.out.println("TOKEN NOT EXPIRED: " + notExpired);
//            System.out.println("=================================");
//
//            return notExpired;
//
//        } catch (Exception e) {
//
//            System.out.println(
//                    "Token validation failed: " +
//                            e.getMessage()
//            );
//
//            return false;
//        }
//    }



    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);

            return claims.getExpiration() != null
                    && claims.getExpiration().after(new Date());

        } catch (Exception e) {
            return false;
        }
    }

}