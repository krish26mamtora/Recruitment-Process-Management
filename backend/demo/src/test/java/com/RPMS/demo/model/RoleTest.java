package com.RPMS.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class RoleTest {

    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setRoleId(1L);
        role.setRoleName("ROLE_ADMIN");
        role.setUsers(new HashSet<>());
    }

    @Test
    void testGettersAndSetters() {
        assertEquals(1L, role.getRoleId());
        assertEquals("ROLE_ADMIN", role.getRoleName());
        assertNotNull(role.getUsers());
    }

    @Test
    void testSetRoleId() {
        role.setRoleId(2L);

        assertEquals(2L, role.getRoleId());
    }

    @Test
    void testSetRoleName() {
        role.setRoleName("ROLE_USER");

        assertEquals("ROLE_USER", role.getRoleName());
    }

    @Test
    void testSetUsers() {
        Set<User> users = new HashSet<>();
        User user = new User();
        user.setUserId(1L);
        users.add(user);
        role.setUsers(users);

        assertEquals(1, role.getUsers().size());
        assertTrue(role.getUsers().stream().anyMatch(u -> u.getUserId().equals(1L)));
    }

    @Test
    void testDefaultConstructor() {
        Role defaultRole = new Role();
        assertNotNull(defaultRole);
        assertNull(defaultRole.getRoleId());
        assertNull(defaultRole.getRoleName());
        assertNotNull(defaultRole.getUsers());
    }
}
