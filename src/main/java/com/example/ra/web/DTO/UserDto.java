package com.example.ra.web.DTO;

import com.example.ra.persistence.models.Role;
import com.example.ra.web.Validation.ValidEmail;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    @NotNull
    @NotEmpty
    private String firstName;

    @NotNull
    @NotEmpty
    private String lastName;

    @NotNull
    @NotEmpty
    private String password;

    @NotNull
    @NotEmpty
    @ValidEmail
    private String email;

    private Role role;
}
