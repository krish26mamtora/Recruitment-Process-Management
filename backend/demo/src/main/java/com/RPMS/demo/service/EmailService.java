package com.RPMS.demo.service;

public interface EmailService {
    void sendCandidateJobAssignmentEmail(String toEmail, String candidateName, String jobTitle, boolean isSelfApplied);
}
