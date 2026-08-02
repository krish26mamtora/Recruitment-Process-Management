package com.RPMS.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPasswordHash("hashedpassword");
        user.setFullName("Test User");
        user.setStatus(User.Status.active);
        user.setCreatedAt(LocalDateTime.now());
        user.setRoles(new HashSet<>());
    }

    @Test
    void testGettersAndSetters() {
        assertEquals(1L, user.getUserId());
        assertEquals("testuser", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("hashedpassword", user.getPasswordHash());
        assertEquals("Test User", user.getFullName());
        assertEquals(User.Status.active, user.getStatus());
        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getRoles());
    }

    @Test
    void testSetUserId() {
        user.setUserId(2L);

        assertEquals(2L, user.getUserId());
    }

    @Test
    void testSetUsername() {
        user.setUsername("newuser");

        assertEquals("newuser", user.getUsername());
    }

    @Test
    void testSetEmail() {
        user.setEmail("new@example.com");

        assertEquals("new@example.com", user.getEmail());
    }

    @Test
    void testSetPasswordHash() {
        user.setPasswordHash("newhash");

        assertEquals("newhash", user.getPasswordHash());
    }

    @Test
    void testSetFullName() {
        user.setFullName("New User");

        assertEquals("New User", user.getFullName());
    }

    @Test
    void testSetStatus() {
        user.setStatus(User.Status.inactive);

        assertEquals(User.Status.inactive, user.getStatus());
    }

    @Test
    void testSetRoles() {
        Set<Role> roles = new HashSet<>();
        Role role = new Role();
        role.setRoleId(1L);
        roles.add(role);
        user.setRoles(roles);

        assertEquals(1, user.getRoles().size());
        assertTrue(user.getRoles().stream().anyMatch(r -> r.getRoleId().equals(1L)));
    }

    @Test
    void testStatusEnum() {
        assertEquals(User.Status.active, User.Status.valueOf("active"));
        assertEquals(User.Status.inactive, User.Status.valueOf("inactive"));
    }

    @Test
    void testDefaultConstructor() {
        User defaultUser = new User();
        assertNotNull(defaultUser);
        assertNull(defaultUser.getUserId());
        assertNull(defaultUser.getUsername());
        assertNull(defaultUser.getEmail());
        assertEquals(User.Status.active, defaultUser.getStatus());
    }
}
