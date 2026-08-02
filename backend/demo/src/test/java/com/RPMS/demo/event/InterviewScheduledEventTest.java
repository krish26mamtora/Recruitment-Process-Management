package com.RPMS.demo.event;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class InterviewScheduledEventTest {

    private InterviewScheduledEvent event;

    @BeforeEach
    void setUp() {
        event = new InterviewScheduledEvent(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time",
                Arrays.asList("interviewer1@example.com", "interviewer2@example.com")
        );
    }

    @Test
    void testConstructorAndGetters() {
        assertEquals("candidate@example.com", event.getToEmail());
        assertEquals("John Doe", event.getCandidateName());
        assertEquals("Software Engineer", event.getJobTitle());
        assertEquals("Technical Round", event.getRound());
        assertEquals("2024-01-15T10:00:00", event.getScheduledAtText());
        assertEquals("https://meet.google.com/abc-defg-hij", event.getMeetLink());
        assertEquals("Please join on time", event.getMessage());
        assertEquals(2, event.getInterviewerEmails().size());
        assertTrue(event.getInterviewerEmails().contains("interviewer1@example.com"));
        assertTrue(event.getInterviewerEmails().contains("interviewer2@example.com"));
    }

    @Test
    void testEventWithEmptyInterviewerList() {
        InterviewScheduledEvent eventNoInterviewers = new InterviewScheduledEvent(
                "candidate@example.com",
                "Jane Doe",
                "Senior Developer",
                "HR Round",
                "2024-01-16T14:00:00",
                "https://meet.google.com/xyz-uvw-rst",
                "Final round",
                Collections.emptyList()
        );

        assertEquals("candidate@example.com", eventNoInterviewers.getToEmail());
        assertEquals("Jane Doe", eventNoInterviewers.getCandidateName());
        assertEquals("Senior Developer", eventNoInterviewers.getJobTitle());
        assertEquals("HR Round", eventNoInterviewers.getRound());
        assertEquals("2024-01-16T14:00:00", eventNoInterviewers.getScheduledAtText());
        assertEquals("https://meet.google.com/xyz-uvw-rst", eventNoInterviewers.getMeetLink());
        assertEquals("Final round", eventNoInterviewers.getMessage());
        assertTrue(eventNoInterviewers.getInterviewerEmails().isEmpty());
    }

    @Test
    void testEventWithNullInterviewerList() {
        InterviewScheduledEvent eventNullInterviewers = new InterviewScheduledEvent(
                "candidate@example.com",
                "Test User",
                "Test Job",
                "Test Round",
                "2024-01-17T09:00:00",
                "https://meet.google.com/test",
                "Test message",
                null
        );

        assertNull(eventNullInterviewers.getInterviewerEmails());
    }
}
