package com.RPMS.demo.event;

import com.RPMS.demo.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InterviewEventListenerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private InterviewEventListener listener;

    private InterviewScheduledEvent interviewEvent;
    private ApplicationStatusUpdatedEvent statusEvent;

    @BeforeEach
    void setUp() {
        interviewEvent = new InterviewScheduledEvent(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time",
                Arrays.asList("interviewer1@example.com", "interviewer2@example.com")
        );

        statusEvent = new ApplicationStatusUpdatedEvent(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "SELECTED",
                "Great technical skills"
        );
    }

    @Test
    void testOnInterviewScheduled() {
        listener.onInterviewScheduled(interviewEvent);

        verify(emailService, times(1)).sendInterviewScheduledEmail(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time"
        );

        verify(emailService, times(1)).sendInterviewerNotificationEmail(
                "interviewer1@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time"
        );

        verify(emailService, times(1)).sendInterviewerNotificationEmail(
                "interviewer2@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time"
        );
    }

    @Test
    void testOnInterviewScheduledWithNoInterviewers() {
        InterviewScheduledEvent eventNoInterviewers = new InterviewScheduledEvent(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time",
                Collections.emptyList()
        );

        listener.onInterviewScheduled(eventNoInterviewers);

        verify(emailService, times(1)).sendInterviewScheduledEmail(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time"
        );

        verify(emailService, never()).sendInterviewerNotificationEmail(
                anyString(),
                anyString(),
                anyString(),
                anyString(),
                anyString(),
                anyString(),
                anyString()
        );
    }

    @Test
    void testOnStatusUpdated() {
        listener.onStatusUpdated(statusEvent);

        verify(emailService, times(1)).sendApplicationStatusUpdateEmail(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "SELECTED",
                "Great technical skills"
        );
    }
}
