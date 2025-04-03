package com.example.ra.web.errors;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class UserAlreadyExistException extends RuntimeException {

//    why i need it?
    private static final long serialVersionUID = 5861310537366287163L;


    public UserAlreadyExistException(final String message, final Throwable cause) {
        super(message, cause);
    }

    public UserAlreadyExistException(final String message) {
        super(message);
    }

    public UserAlreadyExistException(final Throwable cause) {
        super(cause);
    }

}
