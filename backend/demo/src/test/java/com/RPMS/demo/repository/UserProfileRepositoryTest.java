package com.RPMS.demo.repository;

import com.RPMS.demo.model.UserProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class UserProfileRepositoryTest {

    @Autowired
    private UserProfileRepository userProfileRepository;

    private UserProfile userProfile;

    @BeforeEach
    void setUp() {
        userProfile = new UserProfile();
        userProfile.setUserId(1L);
        userProfile.setFullName("John Doe");
        userProfile.setEmail("john@example.com");
    }

    @Test
    void testSaveAndFindById() {
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        assertNotNull(savedProfile);
        assertNotNull(savedProfile.getUserId());
        assertEquals("John Doe", savedProfile.getFullName());
    }

    @Test
    void testFindById() {
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        UserProfile foundProfile = userProfileRepository.findById(savedProfile.getUserId()).orElse(null);

        assertNotNull(foundProfile);
        assertEquals("John Doe", foundProfile.getFullName());
    }
}
