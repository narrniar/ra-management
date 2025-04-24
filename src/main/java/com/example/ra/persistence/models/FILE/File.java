package com.example.ra.persistence.models.FILE;

import com.example.ra.persistence.models.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "files")
@Inheritance(strategy = InheritanceType.JOINED)
public class File {
    @Id
    @GeneratedValue
    @Column(name = "file_id")
    private String fileId;

    @Column(name = "file_code", unique = true)
    private String fileCode;

    @Column(name = "creation_date")
    @CreationTimestamp
    private LocalDateTime creationDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
