//package com.example.ra.persistence.services;
//
//import com.example.ra.persistence.dao.TokenRepository;
//import com.example.ra.persistence.models.TOKEN.Token;
//import com.example.ra.persistence.models.TOKEN.TokenType;
//import com.example.ra.persistence.models.User;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.ArgumentCaptor;
//import org.mockito.Captor;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.time.Instant;
//import java.util.Arrays;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
///**
// * Unit tests for the TokenService class.
// * These tests use Mockito to mock dependencies.
// */
//@ExtendWith(MockitoExtension.class)
//class TokenServiceTest {
//
//    @Mock
//    private TokenRepository tokenRepository;
//
//    @InjectMocks
//    private TokenService tokenService;
//
//    @Captor
//    private ArgumentCaptor<Token> tokenCaptor;
//
//    private User testUser;
//    private Token testToken;
//    private List<Token> validTokens;
//
//    @BeforeEach
//    void setUp() {
//        // Create test data before each test
//        testUser = new User();
//        testUser.setId(1L);
//        testUser.setEmail("test@example.com");
//
//        testToken = new Token();
//        testToken.setId(1L);
//        testToken.setToken("test-jwt-token");
//        testToken.setTokenType(TokenType.BEARER);
//        testToken.setUser(testUser);
//        testToken.setRevoked(false);
//        testToken.setExpired(false);
//
//        Token testToken2 = new Token();
//        testToken2.setId(2L);
//        testToken2.setToken("test-refresh-token");
//        testToken2.setTokenType(TokenType.REFRESH);
//        testToken2.setUser(testUser);
//        testToken2.setRevoked(false);
//        testToken2.setExpired(false);
//
//        validTokens = Arrays.asList(testToken, testToken2);
//    }
//
//    @Test
//    void saveToken_ShouldSaveTokenWithUserAndJwtToken() {
//        // Arrange
//        when(tokenRepository.save(any(Token.class))).thenReturn(testToken);
//
//        // Act
//        tokenService.saveTokenWithUser(testUser, "test-jwt-token");
//
//        // Assert
//        verify(tokenRepository).save(tokenCaptor.capture());
//        Token capturedToken = tokenCaptor.getValue();
//
//        assertEquals(testUser, capturedToken.getUser());
//        assertEquals("test-jwt-token", capturedToken.getToken());
//        assertFalse(capturedToken.isExpired());
//        assertFalse(capturedToken.isRevoked());
//    }
//
//    @Test
//    void getJwtToken_WithExistingToken_ShouldReturnToken() {
//        // Arrange
//        when(tokenRepository.findByToken("test-jwt-token")).thenReturn(Optional.of(testToken));
//
//        // Act
//        Token result = tokenService.getJwtToken("test-jwt-token");
//
//        // Assert
//        assertNotNull(result);
//        assertEquals("test-jwt-token", result.getToken());
//        verify(tokenRepository).findByToken("test-jwt-token");
//    }
//
//    @Test
//    void getJwtToken_WithNonExistingToken_ShouldReturnNull() {
//        // Arrange
//        when(tokenRepository.findByToken("non-existing-token")).thenReturn(Optional.empty());
//
//        // Act
//        Token result = tokenService.getJwtToken("non-existing-token");
//
//        // Assert
//        assertNull(result);
//        verify(tokenRepository).findByToken("non-existing-token");
//    }
//
//    @Test
//    void revokeAllUserTokens_WithValidTokens_ShouldRevokeAllTokens() {
//        // Arrange
//        when(tokenRepository.findAllValidTokenByUser(1L)).thenReturn(validTokens);
//        when(tokenRepository.saveAll(anyList())).thenReturn(validTokens);
//
//        // Act
//        tokenService.revokeAllUserTokens(testUser);
//
//        // Assert
//        verify(tokenRepository).findAllValidTokenByUser(1L);
//        verify(tokenRepository).saveAll(anyList());
//
//        // Verify that all tokens were revoked
//        assertTrue(validTokens.stream().allMatch(Token::isRevoked));
//        assertTrue(validTokens.stream().allMatch(Token::isExpired));
//    }
//
//    @Test
//    void revokeAllUserTokens_WithNoValidTokens_ShouldDoNothing() {
//        // Arrange
//        when(tokenRepository.findAllValidTokenByUser(1L)).thenReturn(List.of());
//
//        // Act
//        tokenService.revokeAllUserTokens(testUser);
//
//        // Assert
//        verify(tokenRepository).findAllValidTokenByUser(1L);
//        verify(tokenRepository, never()).saveAll(anyList());
//    }
//}