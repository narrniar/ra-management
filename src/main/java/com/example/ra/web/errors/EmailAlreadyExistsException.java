package com.example.ra.web.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Error: Email is already in use!")
public class EmailAlreadyExistsException extends RuntimeException {
    private static final long serialVersionUID = 5861310537366287163L;

    public EmailAlreadyExistsException(final String message, final Throwable cause) {
        super(message, cause);
    }

    public EmailAlreadyExistsException(final String message) {
        super(message);
    }

    public EmailAlreadyExistsException(final Throwable cause) {
        super(cause);
    }
}
