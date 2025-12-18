package com.RPMS.demo.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.RPMS.demo.service.EmailService;

@Component
public class InterviewEventListener {
    private final EmailService emailService;

    public InterviewEventListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @EventListener
    public void onInterviewScheduled(InterviewScheduledEvent event) {
        // Send email to candidate
        emailService.sendInterviewScheduledEmail(
                event.getToEmail(),
                event.getCandidateName(),
                event.getJobTitle(),
                event.getRound(),
                event.getScheduledAtText(),
                event.getMeetLink(),
                event.getMessage());

        // Send email to all interviewers (panel interview)
        if (event.getInterviewerEmails() != null && !event.getInterviewerEmails().isEmpty()) {
            for (String interviewerEmail : event.getInterviewerEmails()) {
                if (interviewerEmail != null && !interviewerEmail.isBlank()) {
                    emailService.sendInterviewerNotificationEmail(
                            interviewerEmail,
                            event.getCandidateName(),
                            event.getJobTitle(),
                            event.getRound(),
                            event.getScheduledAtText(),
                            event.getMeetLink(),
                            event.getMessage());
                }
            }
        }
    }

    @EventListener
    public void onStatusUpdated(ApplicationStatusUpdatedEvent event) {
        emailService.sendApplicationStatusUpdateEmail(
                event.getToEmail(),
                event.getCandidateName(),
                event.getJobTitle(),
                event.getStatus(),
                event.getRemarks());
    }
}
