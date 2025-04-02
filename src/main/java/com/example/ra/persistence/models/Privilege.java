package com.example.ra.persistence.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Entity
@Table(name = "privileges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Privilege {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "privileges")
    private Collection<Role> roles;
}
