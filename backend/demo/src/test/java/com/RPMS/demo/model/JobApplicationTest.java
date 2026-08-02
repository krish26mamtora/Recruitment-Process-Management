package com.RPMS.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

public class JobApplicationTest {

    private JobApplication jobApplication;

    @BeforeEach
    void setUp() {
        jobApplication = new JobApplication();
        jobApplication.setId(1);
        jobApplication.setFullName("John Doe");
        jobApplication.setEmail("john@example.com");
        jobApplication.setPhone("1234567890");
        jobApplication.setGender("Male");
        jobApplication.setAge(25);
        jobApplication.setAddress("123 Street");
        jobApplication.setCollegeName("MIT");
        jobApplication.setDegree("B.Tech");
        jobApplication.setBranch("Computer Science");
        jobApplication.setCpi(8.5);
        jobApplication.setExperience("2 years");
        jobApplication.setWhyJoin("To grow");
        jobApplication.setFileName("resume.pdf");
        jobApplication.setContentType("application/pdf");
        jobApplication.setApplicationDate(Instant.now());
        jobApplication.setStatus("Pending");
        jobApplication.setRemarks("Good candidate");
    }

    @Test
    void testGettersAndSetters() {
        assertEquals(1, jobApplication.getId());
        assertEquals("John Doe", jobApplication.getFullName());
        assertEquals("john@example.com", jobApplication.getEmail());
        assertEquals("1234567890", jobApplication.getPhone());
        assertEquals("Male", jobApplication.getGender());
        assertEquals(25, jobApplication.getAge());
        assertEquals("123 Street", jobApplication.getAddress());
        assertEquals("MIT", jobApplication.getCollegeName());
        assertEquals("B.Tech", jobApplication.getDegree());
        assertEquals("Computer Science", jobApplication.getBranch());
        assertEquals(8.5, jobApplication.getCpi());
        assertEquals("2 years", jobApplication.getExperience());
        assertEquals("To grow", jobApplication.getWhyJoin());
        assertEquals("resume.pdf", jobApplication.getFileName());
        assertEquals("application/pdf", jobApplication.getContentType());
        assertNotNull(jobApplication.getApplicationDate());
        assertEquals("Pending", jobApplication.getStatus());
        assertEquals("Good candidate", jobApplication.getRemarks());
    }

    @Test
    void testSetJob() {
        Job job = new Job();
        job.setJobId(1);
        jobApplication.setJob(job);

        assertEquals(job, jobApplication.getJob());
    }

    @Test
    void testSetCandidate() {
        User user = new User();
        user.setUserId(1L);
        jobApplication.setCandidate(user);

        assertEquals(user, jobApplication.getCandidate());
    }

    @Test
    void testSetResumeData() {
        byte[] resumeData = "sample resume data".getBytes();
        jobApplication.setResumeData(resumeData);

        assertArrayEquals(resumeData, jobApplication.getResumeData());
    }

    @Test
    void testPopulateForeignKeys() {
        Job job = new Job();
        job.setJobId(1);
        jobApplication.setJob(job);

        User user = new User();
        user.setUserId(1L);
        jobApplication.setCandidate(user);

        jobApplication.populateForeignKeys();

        assertEquals(1, jobApplication.getJobIdFk());
        assertEquals(1L, jobApplication.getCandidateIdFk());
    }

    @Test
    void testDefaultConstructor() {
        JobApplication defaultApplication = new JobApplication();
        assertNotNull(defaultApplication);
        assertNull(defaultApplication.getId());
        assertNull(defaultApplication.getFullName());
    }
}
