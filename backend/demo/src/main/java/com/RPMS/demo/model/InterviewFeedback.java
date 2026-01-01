package com.RPMS.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "interview_feedback")
public class InterviewFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonIgnore
    private JobApplication jobApplication;

    @Column(name = "interview_round")
    private String round; // Technical, HR, Custom...

    @Column(name = "interviewer_name")
    private String interviewerName; // Can be email or name

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    // We can store ratings as JSON string: {"Java": 4, "React": 5}
    @Column(name = "ratings_json", columnDefinition = "TEXT")
    private String ratingsJson;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobApplication getJobApplication() {
        return jobApplication;
    }

    public void setJobApplication(JobApplication jobApplication) {
        this.jobApplication = jobApplication;
    }

    public String getRound() {
        return round;
    }

    public void setRound(String round) {
        this.round = round;
    }

    public String getInterviewerName() {
        return interviewerName;
    }

    public void setInterviewerName(String interviewerName) {
        this.interviewerName = interviewerName;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getRatingsJson() {
        return ratingsJson;
    }

    public void setRatingsJson(String ratingsJson) {
        this.ratingsJson = ratingsJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
