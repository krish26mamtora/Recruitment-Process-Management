package com.RPMS.demo.dto;

import com.RPMS.demo.model.Role;
import com.RPMS.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class UserDtoTest {

    private UserDto userDto;

    @BeforeEach
    void setUp() {
        userDto = new UserDto();
        userDto.setUserId(1L);
        userDto.setUsername("testuser");
        userDto.setEmail("test@example.com");
        userDto.setFullName("Test User");
        userDto.setStatus(User.Status.ACTIVE);
        userDto.setCreatedAt(LocalDateTime.now());
        userDto.setResumeFileName("resume.pdf");
    }

    @Test
    void testGettersAndSetters() {
        assertEquals(1L, userDto.getUserId());
        assertEquals("testuser", userDto.getUsername());
        assertEquals("test@example.com", userDto.getEmail());
        assertEquals("Test User", userDto.getFullName());
        assertEquals(User.Status.ACTIVE, userDto.getStatus());
        assertNotNull(userDto.getCreatedAt());
        assertEquals("resume.pdf", userDto.getResumeFileName());
    }

    @Test
    void testSettersUpdateFields() {
        userDto.setUserId(2L);
        userDto.setUsername("newuser");
        userDto.setEmail("new@example.com");
        userDto.setFullName("New User");
        userDto.setStatus(User.Status.INACTIVE);
        userDto.setResumeFileName("new_resume.pdf");

        assertEquals(2L, userDto.getUserId());
        assertEquals("newuser", userDto.getUsername());
        assertEquals("new@example.com", userDto.getEmail());
        assertEquals("New User", userDto.getFullName());
        assertEquals(User.Status.INACTIVE, userDto.getStatus());
        assertEquals("new_resume.pdf", userDto.getResumeFileName());
    }

    @Test
    void testRoles() {
        Role role = new Role();
        role.setRoleName("ROLE_ADMIN");
        userDto.setRoles(Set.of(role));

        assertNotNull(userDto.getRoles());
        assertEquals(1, userDto.getRoles().size());
        assertTrue(userDto.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getRoleName())));
    }

    @Test
    void testDefaultConstructor() {
        UserDto defaultDto = new UserDto();
        assertNotNull(defaultDto);
        assertNull(defaultDto.getUserId());
        assertNull(defaultDto.getUsername());
        assertNull(defaultDto.getEmail());
    }
}
