package com.example.ra.security.Authentication;

import com.example.ra.security.jwt.CookieService;
import com.example.ra.web.DTO.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final CookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody UserDto userDto, HttpServletResponse response
    ) throws IOException {
        return service.register(userDto, response);
    }
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest authenticationRequest, HttpServletResponse response
    ) throws IOException {


        return service.authenticate(authenticationRequest, response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        return service.refreshToken(request, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Clear cookies
        cookieService.clearTokenCookies(response);
        return ResponseEntity.ok().build();
    }


}