package com.example.ra.persistence.models;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
public enum Privelege {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),
    MANAGER_READ("management:read"),
    MANAGER_UPDATE("management:update"),
    MANAGER_CREATE("management:create"),
    MANAGER_DELETE("management:delete")

    ;

    Privelege(String privelege) {
        this.privelege = privelege;
    }
    @Getter
    private final String privelege;

    public String getPrivelege() {
        return privelege;
    }
}
