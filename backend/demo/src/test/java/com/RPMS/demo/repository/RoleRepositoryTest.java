package com.RPMS.demo.repository;

import com.RPMS.demo.model.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class RoleRepositoryTest {

    @Autowired
    private RoleRepository roleRepository;

    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setRoleName("ROLE_ADMIN");
    }

    @Test
    void testSaveAndFindById() {
        Role savedRole = roleRepository.save(role);

        assertNotNull(savedRole);
        assertNotNull(savedRole.getRoleId());
        assertEquals("ROLE_ADMIN", savedRole.getRoleName());
    }

    @Test
    void testFindByRoleName() {
        roleRepository.save(role);

        Optional<Role> foundRole = roleRepository.findByRoleName("ROLE_ADMIN");

        assertTrue(foundRole.isPresent());
        assertEquals("ROLE_ADMIN", foundRole.get().getRoleName());
    }

    @Test
    void testFindByRoleNameNotFound() {
        Optional<Role> foundRole = roleRepository.findByRoleName("NON_EXISTENT");

        assertFalse(foundRole.isPresent());
    }
}
