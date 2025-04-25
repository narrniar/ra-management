package com.example.ra.persistence.models;

import com.example.ra.persistence.models.TOKEN.Privelege;
import lombok.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.example.ra.persistence.models.TOKEN.Privelege.*;
@Getter
@RequiredArgsConstructor
public enum Role {

    USER(Collections.emptySet()),
    ADMIN(
            Set.of(
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_DELETE,
                    ADMIN_CREATE
            )
    ),
    PA(
            Set.of(
                    PA_READ,
                    PA_UPDATE,
                    PA_DELETE,
                    PA_CREATE
            )
    ),
    RA(
            Set.of(
                    RA_READ,
                    RA_UPDATE,
                    RA_DELETE,
                    RA_CREATE
            )
    );


    private final Set<Privelege> priveleges;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = priveleges
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPrivelege()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}