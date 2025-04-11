package com.example.ra.persistence.services;

import com.example.ra.persistence.dao.TokenRepository;
import com.example.ra.persistence.models.Token;
import com.example.ra.persistence.models.TokenType;
import com.example.ra.persistence.models.User;
import com.example.ra.security.jwt.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;
    private final JwtService jwtService;

    public void saveTokenWithUser(User user, String jwtToken, TokenType tokenType) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(tokenType)
                .expiresAt(jwtService.extractClaim(jwtToken, Claims::getExpiration).toInstant())
                .build();
        tokenRepository.save(token);
    }


    public Instant calculateExpirationDate(TokenType tokenType) {
        Instant now = Instant.now();
        return switch (tokenType) {
            case ACCESS -> now.plusSeconds(30 * 60); // 30 minutes
            case REFRESH -> now.plusSeconds(7 * 24 * 60 * 60); // 7 days
            case PASSWORD_RESET -> now.plusSeconds(60 * 60); // 1 hour
            case EMAIL_VERIFICATION -> now.plusSeconds(24 * 60 * 60); // 24 hours
            case TWO_FACTOR -> now.plusSeconds(10 * 60); // 10 minutes
            case API_KEY -> now.plusSeconds(30 * 24 * 60 * 60); // 30 days
            case DEVICE_REGISTRATION -> now.plusSeconds(48 * 60 * 60); // 48 hours
            case SESSION -> now.plusSeconds(24 * 60 * 60); // 24 hours
        };
    }

    @Scheduled(cron = "0 0 * * * *") // Every hour
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(Instant.now());
    }
}
