package com.RPMS.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "interview_panels")
public class InterviewPanel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false)
    private Integer applicationId;

    @Column(name = "interviewer_email", nullable = false)
    private String interviewerEmail;

    public InterviewPanel() {
    }

    public InterviewPanel(Integer applicationId, String interviewerEmail) {
        this.applicationId = applicationId;
        this.interviewerEmail = interviewerEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Integer applicationId) {
        this.applicationId = applicationId;
    }

    public String getInterviewerEmail() {
        return interviewerEmail;
    }

    public void setInterviewerEmail(String interviewerEmail) {
        this.interviewerEmail = interviewerEmail;
    }
}
