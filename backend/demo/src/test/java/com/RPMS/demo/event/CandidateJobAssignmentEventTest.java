package com.RPMS.demo.event;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class CandidateJobAssignmentEventTest {

    private CandidateJobAssignmentEvent event;

    @BeforeEach
    void setUp() {
        event = new CandidateJobAssignmentEvent(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                true
        );
    }

    @Test
    void testConstructorAndGetters() {
        assertEquals("candidate@example.com", event.getToEmail());
        assertEquals("John Doe", event.getCandidateName());
        assertEquals("Software Engineer", event.getJobTitle());
        assertTrue(event.isSelfApplied());
    }

    @Test
    void testEventWithSelfAppliedFalse() {
        CandidateJobAssignmentEvent recruiterAssignedEvent = new CandidateJobAssignmentEvent(
                "candidate@example.com",
                "Jane Doe",
                "Senior Developer",
                false
        );

        assertEquals("candidate@example.com", recruiterAssignedEvent.getToEmail());
        assertEquals("Jane Doe", recruiterAssignedEvent.getCandidateName());
        assertEquals("Senior Developer", recruiterAssignedEvent.getJobTitle());
        assertFalse(recruiterAssignedEvent.isSelfApplied());
    }

    @Test
    void testEventWithDifferentValues() {
        CandidateJobAssignmentEvent differentEvent = new CandidateJobAssignmentEvent(
                "new@example.com",
                "New User",
                "New Job Title",
                false
        );

        assertEquals("new@example.com", differentEvent.getToEmail());
        assertEquals("New User", differentEvent.getCandidateName());
        assertEquals("New Job Title", differentEvent.getJobTitle());
        assertFalse(differentEvent.isSelfApplied());
    }
}
