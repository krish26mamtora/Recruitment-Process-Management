package com.RPMS.demo.event;

import com.RPMS.demo.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CandidateJobAssignmentEventListenerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private CandidateJobAssignmentEventListener listener;

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
    void testHandleCandidateJobAssignmentEvent() {
        listener.handleCandidateJobAssignmentEvent(event);

        verify(emailService, times(1)).sendCandidateJobAssignmentEmail(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                true
        );
    }

    @Test
    void testHandleCandidateJobAssignmentEventWithRecruiterAssignment() {
        CandidateJobAssignmentEvent recruiterEvent = new CandidateJobAssignmentEvent(
                "candidate@example.com",
                "Jane Doe",
                "Senior Developer",
                false
        );

        listener.handleCandidateJobAssignmentEvent(recruiterEvent);

        verify(emailService, times(1)).sendCandidateJobAssignmentEmail(
                "candidate@example.com",
                "Jane Doe",
                "Senior Developer",
                false
        );
    }
}
