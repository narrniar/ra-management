package com.example.ra.persistence.models.TOKEN;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Privelege {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),
    RA_READ("ra:read"),
    RA_UPDATE("ra:update"),
    RA_CREATE("ra:create"),
    RA_DELETE("ra:delete"),
    PA_READ("pa:read"),
    PA_UPDATE("pa:update"),
    PA_CREATE("pa:create"),
    PA_DELETE("pa:delete"),

    ;

    
    private final String privelege;

    
}
