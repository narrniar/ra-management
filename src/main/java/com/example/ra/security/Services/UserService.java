package com.example.ra.security.Services;


import com.example.ra.persistence.dao.RoleRepository;
import com.example.ra.persistence.dao.TokenRepository;
import com.example.ra.persistence.dao.UserRepository;
import com.example.ra.persistence.models.Token;
import com.example.ra.persistence.models.User;
import com.example.ra.security.jwt.JwtService;
import com.example.ra.web.DTO.UserDto;
import com.nimbusds.openid.connect.sdk.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(UserDto userDto) {
        User user = User.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode( userDto.getPassword()))
                .roles(Collections.singletonList(roleRepository.findByName("ROLE_USER")))
                .build();
        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateJwtToken(user);
//        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user);
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public User getUser(final String JwtToken) {
        final Token token = tokenRepository.findByToken(JwtToken)
                .orElse(null);
        if (token != null) {
            return token.getUser();
        }
        return null;
    }

    public Token getJwtToken(final String JwtToken) {
        return tokenRepository.findByToken(JwtToken).orElse(null);
    }

    public void saveRegisteredUser(final User user) {
        userRepository.save(user);
    }

    public void deleteUser(final User user) {
        final Token JwtToken = tokenRepository.findByUser(user);

        if (JwtToken != null) {
            tokenRepository.delete(JwtToken);
        }

        userRepository.delete(user);

//        final PasswordResetToken passwordToken = passwordTokenRepository.findByUser(user);
//
//        if (passwordToken != null) {
//            passwordTokenRepository.delete(passwordToken);
//        }
//
//        userRepository.delete(user);
    }
    public void createJwtTokenForUser(final User user, final String token) {
        var jwtToken = jwtService.generateJwtToken(user);
        tokenRepository.save(myToken);
    }
}
