package com.example.ra.security.jwt;

import com.example.ra.persistence.models.User;
import com.example.ra.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.example.ra.persistence.models.TokenType;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.secret}")
    private String jwtSecret;





    //    CustomUserDetials = UserDetails becuase of auto integration
    public String generateJwtToken(Authentication authentication) {

        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(Date.from(calculateExpirationDate(TokenType.ACCESS)))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateJwtToken(User userPrincipal) {


        return Jwts.builder()
                .setSubject((userPrincipal.getEmail()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(Date.from(calculateExpirationDate(TokenType.ACCESS)))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(User userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(Date.from(calculateExpirationDate(TokenType.REFRESH)))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();

    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);
        return (username.equals(user.getEmail())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
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

}
