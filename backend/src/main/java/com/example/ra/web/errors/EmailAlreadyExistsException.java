package com.example.ra.web.errors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

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

//@ControllerAdvice
//public class CourseTrackerGlobalExceptionHandler extends ResponseEntityExceptionHandler {
//
//    @ExceptionHandler(value = {CourseNotFoundException.class})
//    public ResponseEntity<?> handleCourseNotFound(CourseNotFoundException courseNotFoundException, WebRequest request) {
//        return handleExceptionInternal(courseNotFoundException,
//                courseNotFoundException.getMessage(), new HttpHeaders(), HttpStatus.NOT_FOUND, request);
//    }
//}