package com.example.ra.persistence.dao;

import com.example.ra.persistence.models.FILE.File;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FileRepository extends JpaRepository<File, Long> {


}
