//package com.example.ra.persistence.dao;
//
//import com.example.ra.persistence.models.User;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
//import org.springframework.test.context.ActiveProfiles;
//
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//
///**
// * Integration tests for the UserRepository.
// * These tests use an in-memory database.
// */
//@DataJpaTest
//@ActiveProfiles("test") // Ensure we're using the test profile
//class UserRepositoryIntegrationTest {
//
//    @Autowired
//    private TestEntityManager entityManager;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Test
//    void findByEmail_WithExistingEmail_ShouldReturnUser() {
//        // Arrange
//        User user = new User();
//        user.setEmail("test@example.com");
//        user.setFirstName("Test");
//        user.setLastName("User");
//        user.setPassword("password");
//
//        entityManager.persist(user);
//        entityManager.flush();
//
//        // Act
//        Optional<User> found = userRepository.findByEmail("test@example.com");
//
//        // Assert
//        assertTrue(found.isPresent());
//        assertEquals("test@example.com", found.get().getEmail());
//    }
//
//    @Test
//    void findByEmail_WithNonExistingEmail_ShouldReturnEmpty() {
//        // Act
//        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
//
//        // Assert
//        assertTrue(found.isEmpty());
//    }
//
//    @Test
//    void save_ShouldPersistAndRetrieveUser() {
//        // Arrange
//        User user = new User();
//        user.setEmail("save-test@example.com");
//        user.setFirstName("Save");
//        user.setLastName("Test");
//        user.setPassword("password");
//
//        // Act
//        User savedUser = userRepository.save(user);
//
//        // Assert
//        assertNotNull(savedUser.getId());
//
//        // Verify using entityManager
//        User foundUser = entityManager.find(User.class, savedUser.getId());
//        assertNotNull(foundUser);
//        assertEquals("save-test@example.com", foundUser.getEmail());
//    }
//
//    @Test
//    void delete_ShouldRemoveUser() {
//        // Arrange
//        User user = new User();
//        user.setEmail("delete-test@example.com");
//        user.setFirstName("Delete");
//        user.setLastName("Test");
//        user.setPassword("password");
//
//        user = entityManager.persist(user);
//        entityManager.flush();
//
//        // Act
//        userRepository.delete(user);
//        entityManager.flush();
//
//        // Assert
//        User foundUser = entityManager.find(User.class, user.getId());
//        assertNull(foundUser);
//    }
//}