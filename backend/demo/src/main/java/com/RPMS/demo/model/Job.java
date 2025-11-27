package com.RPMS.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "jobs")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jobId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer minExperienceYears;

    @Column(nullable = false)
    private String status = "open"; // open, closed, on_hold

    @Column(columnDefinition = "TEXT")
    private String reasonClosed;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime closedAt;

    private Integer assignedRecruiterId;
    private Integer createdBy;

    // @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    // private Set<JobSkill> jobSkills;
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @com.fasterxml.jackson.annotation.JsonIgnore // ignore raw collection, rely on computed skills
    private Set<JobSkill> jobSkills;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore // prevent heavy serialization and lazy issues
    private Set<JobApplication> jobApplications;

    public Set<JobApplication> getJobApplications() {
        return jobApplications;
    }

    public void setJobApplications(Set<JobApplication> jobApplications) {
        this.jobApplications = jobApplications;
    }

    // Getters and Setters
    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMinExperienceYears() {
        return minExperienceYears;
    }

    public void setMinExperienceYears(Integer minExperienceYears) {
        this.minExperienceYears = minExperienceYears;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReasonClosed() {
        return reasonClosed;
    }

    public void setReasonClosed(String reasonClosed) {
        this.reasonClosed = reasonClosed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }

    public Integer getAssignedRecruiterId() {
        return assignedRecruiterId;
    }

    public void setAssignedRecruiterId(Integer assignedRecruiterId) {
        this.assignedRecruiterId = assignedRecruiterId;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public Set<JobSkill> getJobSkills() {
        return jobSkills;
    }

    public void setJobSkills(Set<JobSkill> jobSkills) {
        this.jobSkills = jobSkills;
    }

    @jakarta.persistence.Transient
    @com.fasterxml.jackson.annotation.JsonProperty("skills")
    public java.util.List<java.util.Map<String, Object>> getSkills() {
        if (jobSkills == null) return new java.util.ArrayList<>();
        java.util.List<java.util.Map<String, Object>> list = new java.util.ArrayList<>();
        for (JobSkill js : jobSkills) {
            Skill s = js.getSkill();
            if (s != null) {
                java.util.Map<String, Object> m = new java.util.HashMap<>();
                m.put("skillId", s.getSkillId());
                m.put("skillName", s.getSkillName());
                m.put("required", java.lang.Boolean.TRUE.equals(js.getRequired()));
                list.add(m);
            }
        }
        return list;
    }
}
