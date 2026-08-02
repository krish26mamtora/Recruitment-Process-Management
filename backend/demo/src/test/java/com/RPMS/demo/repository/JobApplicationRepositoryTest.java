package com.RPMS.demo.repository;

import com.RPMS.demo.model.JobApplication;
import com.RPMS.demo.model.Job;
import com.RPMS.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class JobApplicationRepositoryTest {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    private JobApplication jobApplication;

    @BeforeEach
    void setUp() {
        jobApplication = new JobApplication();
        jobApplication.setFullName("John Doe");
        jobApplication.setEmail("john@example.com");
        jobApplication.setPhone("1234567890");
        jobApplication.setStatus("Pending");
    }

    @Test
    void testSaveAndFindById() {
        JobApplication savedApplication = jobApplicationRepository.save(jobApplication);

        assertNotNull(savedApplication);
        assertNotNull(savedApplication.getId());
        assertEquals("John Doe", savedApplication.getFullName());
    }

    @Test
    void testFindByJobIdFk() {
        jobApplication.setJobIdFk(1);
        jobApplicationRepository.save(jobApplication);

        List<JobApplication> foundApplications = jobApplicationRepository.findByJobIdFk(1);

        assertNotNull(foundApplications);
        assertFalse(foundApplications.isEmpty());
        assertEquals(1, foundApplications.get(0).getJobIdFk());
    }

    @Test
    void testFindByCandidate_UserId() {
        User user = new User();
        user.setUserId(1L);
        jobApplication.setCandidate(user);
        jobApplicationRepository.save(jobApplication);

        List<JobApplication> foundApplications = jobApplicationRepository.findByCandidate_UserId(1L);

        assertNotNull(foundApplications);
        assertFalse(foundApplications.isEmpty());
    }
}
