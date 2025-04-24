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
    MANAGER(
            Set.of(
                    MANAGER_READ,
                    MANAGER_UPDATE,
                    MANAGER_DELETE,
                    MANAGER_CREATE
            )
    )

    ;


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