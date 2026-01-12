package com.RPMS.demo.dto;

import java.util.List;

public class InterviewDetailsDTO {
    private Long applicationId;
    private String candidateName;
    private String candidateEmail;
    private String jobTitle;
    private Integer jobId;
    private String round;
    private String scheduledAt;
    private String meetLink;
    private String message;
    private String status;
    private List<String> interviewerEmails;

    public InterviewDetailsDTO() {
    }

    public InterviewDetailsDTO(Long applicationId, String candidateName, String candidateEmail,
            String jobTitle, Integer jobId, String round, String scheduledAt,
            String meetLink, String message, String status, List<String> interviewerEmails) {
        this.applicationId = applicationId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.jobTitle = jobTitle;
        this.jobId = jobId;
        this.round = round;
        this.scheduledAt = scheduledAt;
        this.meetLink = meetLink;
        this.message = message;
        this.status = status;
        this.interviewerEmails = interviewerEmails;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }

    public String getRound() {
        return round;
    }

    public void setRound(String round) {
        this.round = round;
    }

    public String getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(String scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getMeetLink() {
        return meetLink;
    }

    public void setMeetLink(String meetLink) {
        this.meetLink = meetLink;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getInterviewerEmails() {
        return interviewerEmails;
    }

    public void setInterviewerEmails(List<String> interviewerEmails) {
        this.interviewerEmails = interviewerEmails;
    }
}
