package com.example.ra.security.jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CookieService {

    @Value("${app.jwt.cookie.name:access_token}")
    private String accessTokenCookieName;

    @Value("${app.jwt.cookie.refresh-name:refresh_token}")
    private String refreshTokenCookieName;

    @Value("${app.jwt.cookie.max-age:86400}")
    private int cookieMaxAge;

    @Value("${app.jwt.cookie.secure:true}")
    private boolean secure;

    @Value("${app.jwt.cookie.domain:}")
    private String domain;

    @Value("${app.jwt.cookie.path:/}")
    private String path;

    @Value("${app.jwt.cookie.http-only:true}")
    private boolean httpOnly;

    @Value("${app.jwt.cookie.same-site:Strict}")
    private String sameSite;

    public void createAccessTokenCookie(HttpServletResponse response, String token) {
        createCookie(response, accessTokenCookieName, token, cookieMaxAge);
    }

    public void createRefreshTokenCookie(HttpServletResponse response, String token) {
        createCookie(response, refreshTokenCookieName, token, cookieMaxAge * 7); // Refresh token lives longer
    }

    public void createCookie(HttpServletResponse response, String name, String value, int maxAge) {
        // Construct the Set-Cookie header manually
        String cookieHeader = String.format("%s=%s; Max-Age=%d; Path=%s; %sSameSite=%s",
                name, value, maxAge, path,
                secure ? "Secure; " : "",
                sameSite);

        if (!domain.isEmpty()) {
            cookieHeader += "; Domain=" + domain;
        }

        if (httpOnly) {
            cookieHeader += "; HttpOnly";
        }

        // Add the cookie header to the response
        response.addHeader("Set-Cookie", cookieHeader);
    }

    public void clearCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(secure);
        cookie.setPath(path);
        cookie.setMaxAge(0); // Delete cookie

        if (!domain.isEmpty()) {
            cookie.setDomain(domain);
        }

        response.addCookie(cookie);
    }

    public String extractCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (name.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public void clearTokenCookies(HttpServletResponse response) {
        clearCookie(response, accessTokenCookieName);
        clearCookie(response, refreshTokenCookieName);
    }
}