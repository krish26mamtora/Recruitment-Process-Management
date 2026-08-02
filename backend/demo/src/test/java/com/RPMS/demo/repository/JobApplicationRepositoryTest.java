package com.RPMS.demo.repository;

import com.RPMS.demo.model.JobApplication;
import com.RPMS.demo.model.Job;
import com.RPMS.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class JobApplicationRepositoryTest {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private TestEntityManager entityManager;

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
        Job job = new Job();
        job.setTitle("Software Engineer");
        job = entityManager.persistFlushFind(job);
        jobApplication.setJob(job);
        jobApplicationRepository.save(jobApplication);

        List<JobApplication> foundApplications = jobApplicationRepository.findByJobIdFk(job.getJobId());

        assertNotNull(foundApplications);
        assertFalse(foundApplications.isEmpty());
        assertEquals(job.getJobId(), foundApplications.get(0).getJobIdFk());
    }

    @Test
    void testFindByCandidate_UserId() {
        User user = new User();
        user.setUsername("john.doe");
        user.setEmail("john@example.com");
        user.setPasswordHash("password");
        user = entityManager.persistFlushFind(user);
        jobApplication.setCandidate(user);
        jobApplicationRepository.save(jobApplication);

        List<JobApplication> foundApplications = jobApplicationRepository.findByCandidate_UserId(user.getUserId());

        assertNotNull(foundApplications);
        assertFalse(foundApplications.isEmpty());
    }
}
