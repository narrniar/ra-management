package com.example.ra.persistence.dao;

import com.example.ra.persistence.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);


    List<User> findAllByEmail(String professorEmail);
}
