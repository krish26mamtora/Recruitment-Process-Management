package com.RPMS.demo.event;

public class InterviewScheduledEvent {
    private final String toEmail;
    private final String candidateName;
    private final String jobTitle;
    private final String round;
    private final String scheduledAtText;
    private final String meetLink;
    private final String message;
    private final java.util.List<String> interviewerEmails;

    public InterviewScheduledEvent(String toEmail, String candidateName, String jobTitle,
            String round, String scheduledAtText, String meetLink, String message,
            java.util.List<String> interviewerEmails) {
        this.toEmail = toEmail;
        this.candidateName = candidateName;
        this.jobTitle = jobTitle;
        this.round = round;
        this.scheduledAtText = scheduledAtText;
        this.meetLink = meetLink;
        this.message = message;
        this.interviewerEmails = interviewerEmails;
    }

    public String getToEmail() {
        return toEmail;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getRound() {
        return round;
    }

    public String getScheduledAtText() {
        return scheduledAtText;
    }

    public String getMeetLink() {
        return meetLink;
    }

    public String getMessage() {
        return message;
    }

    public java.util.List<String> getInterviewerEmails() {
        return interviewerEmails;
    }
}
