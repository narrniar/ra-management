package com.example.ra.persistence.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue
    @Column(name = "project_id")
    private String projectId;

    @Column(name = "project_code", unique = true)
    private String projectCode;

    @Column(nullable = false)
    private String title;

    @Column(name = "creation_date")
    @CreationTimestamp
    private LocalDateTime creationDate;

    @ManyToMany
    @JoinTable(
            name = "user_project1",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();
}
