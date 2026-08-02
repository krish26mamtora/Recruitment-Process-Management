package com.RPMS.demo.repository;

import com.RPMS.demo.model.InterviewFeedback;
import com.RPMS.demo.model.JobApplication;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class InterviewFeedbackRepositoryTest {

    @Autowired
    private InterviewFeedbackRepository interviewFeedbackRepository;

    private InterviewFeedback feedback;

    @BeforeEach
    void setUp() {
        feedback = new InterviewFeedback();
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
        
        JobApplication jobApplication = new JobApplication();
        jobApplication.setId(1);
        savedFeedback.setJobApplication(jobApplication);
        interviewFeedbackRepository.save(savedFeedback);

        List<InterviewFeedback> foundFeedbacks = interviewFeedbackRepository.findByJobApplication_Id(1);

        assertNotNull(foundFeedbacks);
        assertFalse(foundFeedbacks.isEmpty());
    }
}
