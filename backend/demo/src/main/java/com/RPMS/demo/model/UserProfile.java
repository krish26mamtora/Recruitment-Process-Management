package com.RPMS.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    private Long userId; // Link to users.userId

    // Basic Personal Details
    private String fullName;
    private String email;
    private String phone;
    private String city;
    private String profilePhotoUrl; // optional URL

    // Ps
    private String currentJobTitle;
    @Column(columnDefinition = "TEXT")
    private String summary; // optional

    // for skills in text ,,,,,,, a , b , c format
    @Column(columnDefinition = "TEXT")
    private String skills;

    // exp
    @Lob
    @Column(columnDefinition = "TEXT")
    private String experiencesJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String educationJson;

    // watch ---later
    @Lob
    @Column(columnDefinition = "TEXT")
    private String certificationsJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String projectsJson;

    // 8. Attachments
    @Lob
    @Column(columnDefinition = "TEXT")
    private String attachmentsJson;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "resume")
    private byte[] resume;

    private String resumeFileName;
    private String resumeFileType;

    private String linkedin;
    private String github;
    private String portfolio;
    private Integer expectedSalary;
    private String noticePeriod;
    private String preferredJobLocation;
    private String jobTypePreference;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public String getCurrentJobTitle() {
        return currentJobTitle;
    }

    public void setCurrentJobTitle(String currentJobTitle) {
        this.currentJobTitle = currentJobTitle;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getExperiencesJson() {
        return experiencesJson;
    }

    public void setExperiencesJson(String experiencesJson) {
        this.experiencesJson = experiencesJson;
    }

    public String getEducationJson() {
        return educationJson;
    }

    public void setEducationJson(String educationJson) {
        this.educationJson = educationJson;
    }

    public String getCertificationsJson() {
        return certificationsJson;
    }

    public void setCertificationsJson(String certificationsJson) {
        this.certificationsJson = certificationsJson;
    }

    public String getProjectsJson() {
        return projectsJson;
    }

    public void setProjectsJson(String projectsJson) {
        this.projectsJson = projectsJson;
    }

    public String getAttachmentsJson() {
        return attachmentsJson;
    }

    public void setAttachmentsJson(String attachmentsJson) {
        this.attachmentsJson = attachmentsJson;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public Integer getExpectedSalary() {
        return expectedSalary;
    }

    public void setExpectedSalary(Integer expectedSalary) {
        this.expectedSalary = expectedSalary;
    }

    public String getNoticePeriod() {
        return noticePeriod;
    }

    public void setNoticePeriod(String noticePeriod) {
        this.noticePeriod = noticePeriod;
    }

    public String getPreferredJobLocation() {
        return preferredJobLocation;
    }

    public void setPreferredJobLocation(String preferredJobLocation) {
        this.preferredJobLocation = preferredJobLocation;
    }

    public String getJobTypePreference() {
        return jobTypePreference;
    }

    public void setJobTypePreference(String jobTypePreference) {
        this.jobTypePreference = jobTypePreference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public byte[] getResume() {
        return resume;
    }

    public void setResume(byte[] resume) {
        this.resume = resume;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public String getResumeFileType() {
        return resumeFileType;
    }

    public void setResumeFileType(String resumeFileType) {
        this.resumeFileType = resumeFileType;
    }
}