package com.example.ra.security.Authentication;


import com.example.ra.persistence.dao.TokenRepository;
import com.example.ra.persistence.dao.UserRepository;
import com.example.ra.persistence.models.TOKEN.TokenType;
import com.example.ra.persistence.models.User;
import com.example.ra.persistence.services.TokenService;
import com.example.ra.security.jwt.CookieService;
import com.example.ra.security.jwt.JwtService;
import com.example.ra.web.DTO.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final CookieService cookieService;

    public ResponseEntity<?> register(UserDto userDto, HttpServletResponse response) throws IOException {
        User user = User.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode( userDto.getPassword()))
                .role(userDto.getRole())
                .build();
        var savedUser = userRepository.save(user);

        return ResponseEntity.ok().build();




    }


    @Transactional
    public ResponseEntity<?> authenticate(AuthenticationRequest request, HttpServletResponse response) throws IOException {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail());

        tokenRepository.deleteByUser(user);

        var jwtToken = jwtService.generateJwtToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        tokenService.saveTokenWithUser(user, jwtToken, TokenType.ACCESS);
        tokenService.saveTokenWithUser(user, refreshToken, TokenType.REFRESH);

        UserDto userDto = new UserDto(user.getFirstName(), user.getLastName(), null, user.getEmail(), user.getRole());




        // Add tokens as cookies
        cookieService.createAccessTokenCookie(response, jwtToken);
        cookieService.createRefreshTokenCookie(response, refreshToken);

        // Return minimal response (tokens are in cookies)
        return ResponseEntity.ok(userDto);

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
    public ResponseEntity<?> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshTokenTemp;
        final String userEmail;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return null;
        }
        refreshTokenTemp = authHeader.substring(7);


        userEmail = jwtService.extractUsername(refreshTokenTemp);

        if (userEmail != null) {
            var user = userRepository.findByEmail(userEmail);
            if (jwtService.isTokenValid(refreshTokenTemp, user)) {
                tokenRepository.deleteByUser(user);
            }
            var jwtToken = jwtService.generateJwtToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);

            tokenService.saveTokenWithUser(user, jwtToken, TokenType.ACCESS);
            tokenService.saveTokenWithUser(user, refreshToken, TokenType.REFRESH);



            // Add tokens as cookies
            cookieService.createAccessTokenCookie(response, jwtToken);
            cookieService.createRefreshTokenCookie(response, refreshToken);

            // Return minimal response (tokens are in cookies)
            return ResponseEntity.ok().build();


        }
        return null;

    }








}
