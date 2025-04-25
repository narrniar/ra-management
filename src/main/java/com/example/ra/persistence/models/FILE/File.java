package com.example.ra.persistence.models.FILE;

import com.example.ra.persistence.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "files")
@Inheritance(strategy = InheritanceType.JOINED)
@RequiredArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class File {
    @Id
    @GeneratedValue
    @Column(name = "file_id")
    public Long fileId;


    @Column(name = "file_code", unique = true)
    public String fileCode;

    @Column(name = "creation_date")
    @CreationTimestamp
    public LocalDate creationDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    public User user;

    @Column(name = "status")
    public String status = "PENDING"; // Default value


//    @ManyToOne
//    @JoinColumn(name = "folder_id")
//    private Folder folder;



}
