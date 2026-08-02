package com.RPMS.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

public class InterviewFeedbackTest {

    private InterviewFeedback interviewFeedback;

    @BeforeEach
    void setUp() {
        interviewFeedback = new InterviewFeedback();
        interviewFeedback.setId(1L);
        interviewFeedback.setRound("Technical Round");
        interviewFeedback.setInterviewerName("John Smith");
        interviewFeedback.setComments("Good technical skills");
        interviewFeedback.setRatingsJson("{\"technical\":8,\"communication\":7}");
        interviewFeedback.setCreatedAt(Instant.now());
    }

    @Test
    void testGettersAndSetters() {
        assertEquals(1L, interviewFeedback.getId());
        assertEquals("Technical Round", interviewFeedback.getRound());
        assertEquals("John Smith", interviewFeedback.getInterviewerName());
        assertEquals("Good technical skills", interviewFeedback.getComments());
        assertEquals("{\"technical\":8,\"communication\":7}", interviewFeedback.getRatingsJson());
        assertNotNull(interviewFeedback.getCreatedAt());
    }

    @Test
    void testSetJobApplication() {
        JobApplication jobApplication = new JobApplication();
        jobApplication.setId(1);
        interviewFeedback.setJobApplication(jobApplication);

        assertEquals(jobApplication, interviewFeedback.getJobApplication());
    }

    @Test
    void testSetRound() {
        interviewFeedback.setRound("HR Round");

        assertEquals("HR Round", interviewFeedback.getRound());
    }

    @Test
    void testSetInterviewerName() {
        interviewFeedback.setInterviewerName("Jane Doe");

        assertEquals("Jane Doe", interviewFeedback.getInterviewerName());
    }

    @Test
    void testSetComments() {
        interviewFeedback.setComments("Excellent communication");

        assertEquals("Excellent communication", interviewFeedback.getComments());
    }

    @Test
    void testSetRatingsJson() {
        interviewFeedback.setRatingsJson("{\"communication\":9}");

        assertEquals("{\"communication\":9}", interviewFeedback.getRatingsJson());
    }

    @Test
    void testDefaultConstructor() {
        InterviewFeedback defaultFeedback = new InterviewFeedback();
        assertNotNull(defaultFeedback);
        assertNull(defaultFeedback.getId());
        assertNull(defaultFeedback.getRound());
    }
}
