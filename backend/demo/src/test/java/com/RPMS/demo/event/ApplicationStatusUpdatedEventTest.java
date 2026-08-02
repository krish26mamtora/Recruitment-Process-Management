package com.RPMS.demo.event;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ApplicationStatusUpdatedEventTest {

    private ApplicationStatusUpdatedEvent event;

    @BeforeEach
    void setUp() {
        event = new ApplicationStatusUpdatedEvent(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "SELECTED",
                "Great technical skills"
        );
    }

    @Test
    void testConstructorAndGetters() {
        assertEquals("candidate@example.com", event.getToEmail());
        assertEquals("John Doe", event.getCandidateName());
        assertEquals("Software Engineer", event.getJobTitle());
        assertEquals("SELECTED", event.getStatus());
        assertEquals("Great technical skills", event.getRemarks());
    }

    @Test
    void testEventWithDifferentValues() {
        ApplicationStatusUpdatedEvent differentEvent = new ApplicationStatusUpdatedEvent(
                "jane@example.com",
                "Jane Doe",
                "Senior Developer",
                "REJECTED",
                "Not enough experience"
        );

        assertEquals("jane@example.com", differentEvent.getToEmail());
        assertEquals("Jane Doe", differentEvent.getCandidateName());
        assertEquals("Senior Developer", differentEvent.getJobTitle());
        assertEquals("REJECTED", differentEvent.getStatus());
        assertEquals("Not enough experience", differentEvent.getRemarks());
    }

    @Test
    void testEventWithNullRemarks() {
        ApplicationStatusUpdatedEvent eventWithNullRemarks = new ApplicationStatusUpdatedEvent(
                "test@example.com",
                "Test User",
                "Test Job",
                "PENDING",
                null
        );

        assertEquals("test@example.com", eventWithNullRemarks.getToEmail());
        assertNull(eventWithNullRemarks.getRemarks());
    }
}
