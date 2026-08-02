package com.RPMS.demo.repository;

import com.RPMS.demo.model.InterviewFeedback;
import com.RPMS.demo.model.Job;
import com.RPMS.demo.model.JobApplication;
import com.RPMS.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class InterviewFeedbackRepositoryTest {

    @Autowired
    private InterviewFeedbackRepository interviewFeedbackRepository;

    @Autowired
    private TestEntityManager entityManager;

    private InterviewFeedback feedback;
    private JobApplication jobApplication;

    @BeforeEach
    void setUp() {
        Job job = new Job();
        job.setTitle("Software Engineer");
        job = entityManager.persistFlushFind(job);

        User candidate = new User();
        candidate.setUsername("john.doe");
        candidate.setEmail("john@example.com");
        candidate.setPasswordHash("password");
        candidate = entityManager.persistFlushFind(candidate);

        jobApplication = new JobApplication();
        jobApplication.setJob(job);
        jobApplication.setCandidate(candidate);
        jobApplication.setFullName("John Doe");
        jobApplication.setEmail("john@example.com");
        jobApplication.setPhone("1234567890");
        jobApplication = entityManager.persistFlushFind(jobApplication);

        feedback = new InterviewFeedback();
        feedback.setJobApplication(jobApplication);
        feedback.setRound("Technical Round");
        feedback.setInterviewerName("John Smith");
        feedback.setComments("Good technical skills");
        feedback.setRatingsJson("{\"technical\":8}");
    }

    @Test
    void testSaveAndFindById() {
        InterviewFeedback savedFeedback = interviewFeedbackRepository.save(feedback);

        assertNotNull(savedFeedback);
        assertNotNull(savedFeedback.getId());
        assertEquals("Technical Round", savedFeedback.getRound());
    }

    @Test
    void testFindByJobApplication_Id() {
        InterviewFeedback savedFeedback = interviewFeedbackRepository.save(feedback);

        List<InterviewFeedback> foundFeedbacks = interviewFeedbackRepository.findByJobApplication_Id(jobApplication.getId());

        assertNotNull(foundFeedbacks);
        assertFalse(foundFeedbacks.isEmpty());
        assertEquals(savedFeedback.getId(), foundFeedbacks.get(0).getId());
    }
}
