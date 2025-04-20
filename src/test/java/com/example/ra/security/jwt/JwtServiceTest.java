//package com.example.ra.security.jwt;
//
//import com.example.ra.persistence.models.User;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.test.util.ReflectionTestUtils;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.mock;
//import static org.mockito.Mockito.when;
//
///**
// * Unit tests for the JwtService class.
// */
//class JwtServiceTest {
//
//    private JwtService jwtService;
//    private User testUser;
//    private Authentication authentication;
//
//    @BeforeEach
//    void setUp() {
//        jwtService = new JwtService();
//
//        // Set private fields using reflection
//        ReflectionTestUtils.setField(jwtService, "jwtSecret", "secretKeyForTestingThatIsLongEnoughToBeSecureAndValid");
//        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", 3600000); // 1 hour
//        ReflectionTestUtils.setField(jwtService, "jwtRefreshTokenMS", 86400000); // 24 hours
//
//        // Create test user
//        testUser = new User();
//        testUser.setId(1L);
//        testUser.setEmail("test@example.com");
//
//        // Mock authentication
//        authentication = mock(Authentication.class);
//        UserDetails userDetails = mock(UserDetails.class);
//        when(userDetails.getUsername()).thenReturn("test@example.com");
//        when(authentication.getPrincipal()).thenReturn(userDetails);
//    }
//
//    @Test
//    void generateJwtToken_FromAuthentication_ShouldCreateValidToken() {
//        // Act
//        String token = jwtService.generateJwtToken(authentication);
//
//        // Assert
//        assertNotNull(token);
//        assertTrue(jwtService.validateJwtToken(token));
//        assertEquals("test@example.com", jwtService.extractUsername(token));
//    }
//
//    @Test
//    void generateJwtToken_FromUser_ShouldCreateValidToken() {
//        // Act
//        String token = jwtService.generateJwtToken(testUser);
//
//        // Assert
//        assertNotNull(token);
//        assertTrue(jwtService.validateJwtToken(token));
//        assertEquals("test@example.com", jwtService.extractUsername(token));
//    }
//
//    @Test
//    void generateRefreshToken_ShouldCreateValidToken() {
//        // Act
//        String token = jwtService.generateRefreshToken(testUser);
//
//        // Assert
//        assertNotNull(token);
//        assertTrue(jwtService.validateJwtToken(token));
//        assertEquals("test@example.com", jwtService.extractUsername(token));
//    }
//
//    @Test
//    void validateJwtToken_WithValidToken_ShouldReturnTrue() {
//        // Arrange
//        String token = jwtService.generateJwtToken(testUser);
//
//        // Act & Assert
//        assertTrue(jwtService.validateJwtToken(token));
//    }
//
//    @Test
//    void validateJwtToken_WithInvalidToken_ShouldReturnFalse() {
//        // Act & Assert
//        assertFalse(jwtService.validateJwtToken("invalid.token.format"));
//    }
//
//    @Test
//    void extractUsername_ShouldReturnCorrectEmail() {
//        // Arrange
//        String token = jwtService.generateJwtToken(testUser);
//
//        // Act
//        String username = jwtService.extractUsername(token);
//
//        // Assert
//        assertEquals("test@example.com", username);
//    }
//
//    @Test
//    void isTokenValid_WithValidTokenAndMatchingUser_ShouldReturnTrue() {
//        // Arrange
//        String token = jwtService.generateJwtToken(testUser);
//
//        // Act
//        boolean isValid = jwtService.isTokenValid(token, testUser);
//
//        // Assert
//        assertTrue(isValid);
//    }
//
//    @Test
//    void isTokenValid_WithValidTokenAndNonMatchingUser_ShouldReturnFalse() {
//        // Arrange
//        String token = jwtService.generateJwtToken(testUser);
//
//        User differentUser = new User();
//        differentUser.setEmail("different@example.com");
//
//        // Act
//        boolean isValid = jwtService.isTokenValid(token, differentUser);
//
//        // Assert
//        assertFalse(isValid);
//    }
//}