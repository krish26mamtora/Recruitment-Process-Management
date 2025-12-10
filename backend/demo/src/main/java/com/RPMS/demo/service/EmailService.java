package com.RPMS.demo.service;

public interface EmailService {
    void sendCandidateJobAssignmentEmail(String toEmail, String candidateName, String jobTitle, boolean isSelfApplied);

    void sendInterviewScheduledEmail(String toEmail, String candidateName, String jobTitle,
            String round, String scheduledAtText, String meetLink, String message);

    void sendApplicationStatusUpdateEmail(String toEmail, String candidateName, String jobTitle,
            String status, String remarks);
}
