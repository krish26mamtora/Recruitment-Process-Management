package com.RPMS.demo.event;

public class ApplicationStatusUpdatedEvent {
    private final String toEmail;
    private final String candidateName;
    private final String jobTitle;
    private final String status;
    private final String remarks;

    public ApplicationStatusUpdatedEvent(String toEmail, String candidateName, String jobTitle, String status, String remarks) {
        this.toEmail = toEmail;
        this.candidateName = candidateName;
        this.jobTitle = jobTitle;
        this.status = status;
        this.remarks = remarks;
    }

    public String getToEmail() { return toEmail; }
    public String getCandidateName() { return candidateName; }
    public String getJobTitle() { return jobTitle; }
    public String getStatus() { return status; }
    public String getRemarks() { return remarks; }
}

