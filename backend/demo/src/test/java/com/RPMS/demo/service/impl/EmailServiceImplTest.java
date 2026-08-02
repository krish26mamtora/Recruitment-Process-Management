package com.RPMS.demo.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceImplTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailServiceImpl emailService;

    @Test
    void testSendCandidateJobAssignmentEmail_SelfApplied() {
        emailService.sendCandidateJobAssignmentEmail("candidate@example.com", "John Doe", "Software Engineer", true);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendCandidateJobAssignmentEmail_NotSelfApplied() {
        emailService.sendCandidateJobAssignmentEmail("candidate@example.com", "John Doe", "Software Engineer", false);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendInterviewScheduledEmail() {
        emailService.sendInterviewScheduledEmail(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time"
        );

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendApplicationStatusUpdateEmail() {
        emailService.sendApplicationStatusUpdateEmail(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "SELECTED",
                "Great technical skills"
        );

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendInterviewerNotificationEmail() {
        emailService.sendInterviewerNotificationEmail(
                "interviewer@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time"
        );

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendInterviewFeedbackEmail() {
        emailService.sendInterviewFeedbackEmail(
                "candidate@example.com",
                "John Doe",
                "Software Engineer",
                "Technical Round",
                "John Smith",
                "Good technical skills",
                "{\"technical\":8}"
        );

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
