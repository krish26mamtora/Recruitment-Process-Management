package com.RPMS.demo.repository;

import com.RPMS.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPasswordHash("hashedpassword");
        user.setFullName("Test User");
    }

    @Test
    void testSaveAndFindById() {
        User savedUser = userRepository.save(user);

        assertNotNull(savedUser);
        assertNotNull(savedUser.getUserId());
        assertEquals("testuser", savedUser.getUsername());
    }

    @Test
    void testFindByEmail() {
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByEmail("test@example.com");

        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
    }

    @Test
    void testFindByUsername() {
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByUsername("testuser");

        assertTrue(foundUser.isPresent());
        assertEquals("test@example.com", foundUser.get().getEmail());
    }

    @Test
    void testFindByFullName() {
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByFullName("Test User");

        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
    }

    @Test
    void testFindByEmailNotFound() {
        Optional<User> foundUser = userRepository.findByEmail("nonexistent@example.com");

        assertFalse(foundUser.isPresent());
    }
}
