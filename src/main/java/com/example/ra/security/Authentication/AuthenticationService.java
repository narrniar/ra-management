package com.example.ra.security.Authentication;


import com.example.ra.persistence.dao.TokenRepository;
import com.example.ra.persistence.dao.UserRepository;
import com.example.ra.persistence.models.Token;
import com.example.ra.persistence.models.TokenType;
import com.example.ra.persistence.models.User;
import com.example.ra.persistence.services.TokenService;
import com.example.ra.security.jwt.JwtService;
import com.example.ra.web.DTO.UserDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthenticationResponse register(UserDto userDto) {
        User user = User.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode( userDto.getPassword()))
                .role(userDto.getRole())
                .build();
        var savedUser = userRepository.save(user);




        return GenerateJwtTokenAndRefreshTokenAndReturnAuthenticationResponseWith2(savedUser);
    }


    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail());

        tokenRepository.deleteByUser(user);

        return GenerateJwtTokenAndRefreshTokenAndReturnAuthenticationResponseWith2(user);
    }

    public AuthenticationResponse GenerateJwtTokenAndRefreshTokenAndReturnAuthenticationResponseWith2(User user) {
        var jwtToken = jwtService.generateJwtToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        tokenService.saveTokenWithUser(user, jwtToken, TokenType.ACCESS);
        tokenService.saveTokenWithUser(user, refreshToken, TokenType.REFRESH);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public AuthenticationResponse refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return null;
        }
        refreshToken = authHeader.substring(7);


        userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            var user = userRepository.findByEmail(userEmail);
            if (jwtService.isTokenValid(refreshToken, user)) {
                tokenRepository.deleteByUser(user);
            }
            return GenerateJwtTokenAndRefreshTokenAndReturnAuthenticationResponseWith2(user);

        }
        return null;

    }








}
