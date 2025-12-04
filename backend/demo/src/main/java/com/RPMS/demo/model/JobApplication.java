package com.RPMS.demo.model;

import jakarta.persistence.*;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "job_applications")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" }) // ✅ Fixes proxy serialization
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // --- Relationships ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    @JsonIgnore
    private Job job;

    @Column(name = "job_id", insertable = false, updatable = false)
    @JsonIgnore
    private Integer jobIdFk;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "roles" })
    @JsonIgnore
    private User candidate;

    @Column(name = "candidate_id", insertable = false, updatable = false)
    @JsonIgnore
    private Long candidateIdFk;

    // --- Candidate Info ---
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "gender")
    private String gender;

    @Column(name = "age")
    private Integer age;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    // --- Education Info ---
    @Column(name = "college_name")
    private String collegeName;

    @Column(name = "degree")
    private String degree;

    @Column(name = "branch")
    private String branch;

    @Column(name = "cpi")
    private Double cpi;

    // --- Experience / Motivation ---
    @Column(name = "experience", columnDefinition = "TEXT")
    private String experience;

    @Column(name = "why_join", columnDefinition = "TEXT")
    private String whyJoin;

    // --- Resume Fields ---
    @Lob
    @Basic(fetch = FetchType.LAZY)
    @JsonIgnore
    @Column(name = "resume_data", nullable = false)
    private byte[] resumeData;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "content_type", nullable = false)
    private String contentType;

    // --- Application Metadata ---
    @Column(name = "application_date", nullable = false)
    private Instant applicationDate = Instant.now();

    @Column(name = "status", nullable = false)
    private String status = "Pending";

    @Column(name = "remarks")
    private String remarks;

    // --- Lifecycle callbacks to populate foreign keys ---
    @PostLoad
    @PrePersist
    @PreUpdate
    public void populateForeignKeys() {
        if (job != null) {
            this.jobIdFk = job.getJobId();
        }
        if (candidate != null) {
            this.candidateIdFk = candidate.getUserId();
        }
    }

    // --- Getters & Setters ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public Integer getJobIdFk() {
        return jobIdFk;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public Long getCandidateIdFk() {
        return candidateIdFk;
    }

    public byte[] getResumeData() {
        return resumeData;
    }

    public void setResumeData(byte[] resumeData) {
        this.resumeData = resumeData;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Instant getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(Instant applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCollegeName() {
        return collegeName;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Double getCpi() {
        return cpi;
    }

    public void setCpi(Double cpi) {
        this.cpi = cpi;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getWhyJoin() {
        return whyJoin;
    }

    public void setWhyJoin(String whyJoin) {
        this.whyJoin = whyJoin;
    }
}
