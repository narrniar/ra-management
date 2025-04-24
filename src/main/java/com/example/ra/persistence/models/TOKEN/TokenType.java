package com.example.ra.persistence.models.TOKEN;


public enum TokenType {
    /**
     * Access token used for API authentication.
     * Short-lived token (typically 15-60 minutes).
     */
    ACCESS,

    /**
     * Refresh token used to obtain new access tokens.
     * Long-lived token (typically 7-30 days).
     */
    REFRESH,

    /**
     * Token used for password reset functionality.
     * Short-lived token (typically 1 hour).
     */
    PASSWORD_RESET,

    /**
     * Token used for email verification.
     * Medium-lived token (typically 24 hours).
     */
    EMAIL_VERIFICATION,

    /**
     * Token used for two-factor authentication.
     * Very short-lived token (typically 5-10 minutes).
     */
    TWO_FACTOR,

    /**
     * Token used for API key authentication.
     * Long-lived token (typically 30-90 days).
     */
    API_KEY,

    /**
     * Token used for device registration.
     * Medium-lived token (typically 24-48 hours).
     */
    DEVICE_REGISTRATION,

    /**
     * Token used for session management.
     * Medium-lived token (typically 24 hours).
     */
    SESSION
}
