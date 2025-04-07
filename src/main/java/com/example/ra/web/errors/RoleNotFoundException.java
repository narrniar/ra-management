package com.example.ra.web.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Error: Role is not found.")
public class RoleNotFoundException extends RuntimeException {

}
