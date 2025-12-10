package com.RPMS.demo.service.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.RPMS.demo.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailServiceImpl implements EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendCandidateJobAssignmentEmail(String toEmail, String candidateName, String jobTitle,
            boolean isSelfApplied) {
        String subject = isSelfApplied ? "Application Received" : "Job Assignment Notification";
        String body = isSelfApplied
                ? "Hello " + candidateName + ",\n\nThank you for applying for " + jobTitle
                        + ". We will review your application and get back to you soon.\n\nRegards,\nRecruitment Team"
                : "Hello " + candidateName + ",\n\nYou have been assigned to " + jobTitle
                        + ". Our team will contact you with next steps.\n\nRegards,\nRecruitment Team";
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Sent candidate job email to {} for '{}' (selfApplied={})", toEmail, jobTitle, isSelfApplied);
        } catch (Exception e) {
            log.error("Failed to send candidate job email to {} for '{}'", toEmail, jobTitle, e);
        }
    }

    @Override
    public void sendInterviewScheduledEmail(String toEmail, String candidateName, String jobTitle,
            String round, String scheduledAtText, String meetLink, String message) {
        String subject = "Interview Scheduled: " + jobTitle + " (" + round + ")";
        String body = "Hello " + candidateName + ",\n\n" +
                "Your interview for " + jobTitle + " (" + round + ") has been scheduled." +
                "\nDate & Time: " + scheduledAtText +
                "\nGoogle Meet: " + meetLink +
                (message != null && !message.isBlank() ? ("\n\nNotes: " + message) : "") +
                "\n\nRegards,\nRecruitment Team";
        try {
            SimpleMailMessage messageObj = new SimpleMailMessage();
            messageObj.setTo(toEmail);
            messageObj.setSubject(subject);
            messageObj.setText(body);
            mailSender.send(messageObj);
            log.info("Sent interview scheduled email to {} for '{}'", toEmail, jobTitle);
        } catch (Exception e) {
            log.error("Failed to send interview scheduled email to {} for '{}'", toEmail, jobTitle, e);
        }
    }

    @Override
    public void sendApplicationStatusUpdateEmail(String toEmail, String candidateName, String jobTitle,
            String status, String remarks) {
        String subject = "Application Update: " + jobTitle;
        String body = "Hello " + candidateName + ",\n\n" +
                "Your application status has been updated to: " + status +
                (remarks != null && !remarks.isBlank() ? ("\nNotes: " + remarks) : "") +
                "\n\nRegards,\nRecruitment Team";
        try {
            SimpleMailMessage messageObj = new SimpleMailMessage();
            messageObj.setTo(toEmail);
            messageObj.setSubject(subject);
            messageObj.setText(body);
            mailSender.send(messageObj);
            log.info("Sent status update email to {} for '{}'", toEmail, jobTitle);
        } catch (Exception e) {
            log.error("Failed to send status update email to {} for '{}'", toEmail, jobTitle, e);
        }
    }
}
