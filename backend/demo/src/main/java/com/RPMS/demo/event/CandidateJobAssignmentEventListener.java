package com.RPMS.demo.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.RPMS.demo.service.EmailService;

@Component
public class CandidateJobAssignmentEventListener {
    private final EmailService emailService;

    public CandidateJobAssignmentEventListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @EventListener
    public void handleCandidateJobAssignmentEvent(CandidateJobAssignmentEvent event) {
        emailService.sendCandidateJobAssignmentEmail(
                event.getToEmail(),
                event.getCandidateName(),
                event.getJobTitle(),
                event.isSelfApplied()
        );
    }
}

