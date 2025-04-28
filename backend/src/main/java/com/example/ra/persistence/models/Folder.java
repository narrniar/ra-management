//package com.example.ra.persistence.models;
//
//
//import com.example.ra.persistence.models.FILE.File;
//import jakarta.persistence.Entity;
//import jakarta.persistence.Id;
//import jakarta.persistence.OneToMany;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.RequiredArgsConstructor;
//
//import java.util.List;
//
//@Data
//@Entity
//@RequiredArgsConstructor
//@AllArgsConstructor
//public class Folder {
//
//    @Id
//    private final Long folder_id;
//
//    private final String folder_name;
//
//    @OneToMany(mappedBy = "folder")
//    private final List<File> files;
//}
