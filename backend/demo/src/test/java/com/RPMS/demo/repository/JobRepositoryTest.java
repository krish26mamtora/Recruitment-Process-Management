package com.RPMS.demo.repository;

import com.RPMS.demo.model.Job;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class JobRepositoryTest {

    @Autowired
    private JobRepository jobRepository;

    private Job job;

    @BeforeEach
    void setUp() {
        job = new Job();
        job.setTitle("Software Engineer");
        job.setDescription("Java & Spring Boot role");
        job.setStatus("OPEN");
        job.setMinExperienceYears(2);
    }

    @Test
    void testSaveAndFindById() {
        Job savedJob = jobRepository.save(job);

        assertNotNull(savedJob);
        assertNotNull(savedJob.getJobId());
        assertEquals("Software Engineer", savedJob.getTitle());
    }

    @Test
    void testFindByStatus() {
        jobRepository.save(job);

        List<Job> foundJobs = jobRepository.findByStatus("OPEN");

        assertNotNull(foundJobs);
        assertFalse(foundJobs.isEmpty());
        assertEquals("OPEN", foundJobs.get(0).getStatus());
    }

    @Test
    void testFindByTitleContainingIgnoreCase() {
        jobRepository.save(job);

        List<Job> foundJobs = jobRepository.findByTitleContainingIgnoreCase("software");

        assertNotNull(foundJobs);
        assertFalse(foundJobs.isEmpty());
        assertTrue(foundJobs.get(0).getTitle().toLowerCase().contains("software"));
    }
}
