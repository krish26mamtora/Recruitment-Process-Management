package com.RPMS.demo.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class LoginResponseTest {

    private LoginResponse loginResponse;

    @BeforeEach
    void setUp() {
        Set<String> roles = Set.of("ROLE_USER", "Candidate");
        loginResponse = new LoginResponse(
                true,
                "Login successful",
                "John Doe",
                roles,
                1L,
                "john@example.com"
        );
    }

    @Test
    void testConstructorAndGetters() {
        assertTrue(loginResponse.isSuccess());
        assertEquals("Login successful", loginResponse.getMessage());
        assertEquals("John Doe", loginResponse.getFullName());
        assertEquals(2, loginResponse.getRoles().size());
        assertTrue(loginResponse.getRoles().contains("ROLE_USER"));
        assertTrue(loginResponse.getRoles().contains("Candidate"));
        assertEquals(1L, loginResponse.getUserId());
        assertEquals("john@example.com", loginResponse.getEmail());
    }

    @Test
    void testSetters() {
        loginResponse.setSuccess(false);
        loginResponse.setMessage("Login failed");
        loginResponse.setFullName("Jane Doe");
        loginResponse.setRoles(Set.of("ROLE_ADMIN"));
        loginResponse.setUserId(2L);
        loginResponse.setEmail("jane@example.com");

        assertFalse(loginResponse.isSuccess());
        assertEquals("Login failed", loginResponse.getMessage());
        assertEquals("Jane Doe", loginResponse.getFullName());
        assertEquals(1, loginResponse.getRoles().size());
        assertTrue(loginResponse.getRoles().contains("ROLE_ADMIN"));
        assertEquals(2L, loginResponse.getUserId());
        assertEquals("jane@example.com", loginResponse.getEmail());
    }

    @Test
    void testDefaultConstructor() {
        LoginResponse defaultResponse = new LoginResponse(true, "Test", "Test", Set.of(), 1L, "test@test.com");
        assertNotNull(defaultResponse);
        assertTrue(defaultResponse.isSuccess());
        assertEquals("Test", defaultResponse.getMessage());
    }
}
