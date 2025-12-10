package com.RPMS.demo.event;

public class CandidateJobAssignmentEvent {
    private final String toEmail;
    private final String candidateName;
    private final String jobTitle;
    private final boolean selfApplied;

    public CandidateJobAssignmentEvent(String toEmail, String candidateName, String jobTitle, boolean selfApplied) {
        this.toEmail = toEmail;
        this.candidateName = candidateName;
        this.jobTitle = jobTitle;
        this.selfApplied = selfApplied;
    }

    public String getToEmail() { return toEmail; }
    public String getCandidateName() { return candidateName; }
    public String getJobTitle() { return jobTitle; }
    public boolean isSelfApplied() { return selfApplied; }
}

