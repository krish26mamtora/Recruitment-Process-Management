package com.RPMS.demo.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class LoginRequestTest {

    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void testGettersAndSetters() {
        assertEquals("test@example.com", loginRequest.getEmail());
        assertEquals("password123", loginRequest.getPassword());
    }

    @Test
    void testSettersUpdateFields() {
        loginRequest.setEmail("new@example.com");
        loginRequest.setPassword("newpassword");

        assertEquals("new@example.com", loginRequest.getEmail());
        assertEquals("newpassword", loginRequest.getPassword());
    }

    @Test
    void testDefaultConstructor() {
        LoginRequest defaultRequest = new LoginRequest();
        assertNotNull(defaultRequest);
        assertNull(defaultRequest.getEmail());
        assertNull(defaultRequest.getPassword());
    }

    @Test
    void testNullValues() {
        LoginRequest nullRequest = new LoginRequest();
        nullRequest.setEmail(null);
        nullRequest.setPassword(null);

        assertNull(nullRequest.getEmail());
        assertNull(nullRequest.getPassword());
    }
}
