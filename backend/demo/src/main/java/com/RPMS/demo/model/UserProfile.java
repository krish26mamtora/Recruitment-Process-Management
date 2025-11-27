package com.RPMS.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    private Long userId; // Link to users.userId

    // 1. Basic Personal Details
    private String fullName;
    private String email;
    private String phone;
    private String city;
    private String profilePhotoUrl; // optional URL

    // 2. Professional Summary
    private String currentJobTitle;
    @Column(columnDefinition = "TEXT")
    private String summary; // optional

    // 3. Technical Skills (store as comma-separated tags)
    @Column(columnDefinition = "TEXT")
    private String skillsLanguages;
    @Column(columnDefinition = "TEXT")
    private String skillsFrameworks;
    @Column(columnDefinition = "TEXT")
    private String skillsTools;
    @Column(columnDefinition = "TEXT")
    private String skillsCloud;
    @Column(columnDefinition = "TEXT")
    private String skillsDatabases;
    @Column(columnDefinition = "TEXT")
    private String skillsOther;

    // 4. Work Experience (JSON array as TEXT)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String experiencesJson;

    // 5. Education (JSON array as TEXT)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String educationJson;

    // 6. Certifications (JSON array as TEXT)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String certificationsJson;

    // 7. Projects (JSON array as TEXT)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String projectsJson;

    // 8. Attachments (resumeUrl, coverLetterUrl)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String attachmentsJson;

    // 9. Additional Preferred Fields
    private String linkedin;
    private String github;
    private String portfolio;
    private Integer expectedSalary; // per month or per annum
    private String noticePeriod;
    private String preferredJobLocation;
    private String jobTypePreference; // Remote / Hybrid / Onsite

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public String getCurrentJobTitle() { return currentJobTitle; }
    public void setCurrentJobTitle(String currentJobTitle) { this.currentJobTitle = currentJobTitle; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getSkillsLanguages() { return skillsLanguages; }
    public void setSkillsLanguages(String skillsLanguages) { this.skillsLanguages = skillsLanguages; }

    public String getSkillsFrameworks() { return skillsFrameworks; }
    public void setSkillsFrameworks(String skillsFrameworks) { this.skillsFrameworks = skillsFrameworks; }

    public String getSkillsTools() { return skillsTools; }
    public void setSkillsTools(String skillsTools) { this.skillsTools = skillsTools; }

    public String getSkillsCloud() { return skillsCloud; }
    public void setSkillsCloud(String skillsCloud) { this.skillsCloud = skillsCloud; }

    public String getSkillsDatabases() { return skillsDatabases; }
    public void setSkillsDatabases(String skillsDatabases) { this.skillsDatabases = skillsDatabases; }

    public String getSkillsOther() { return skillsOther; }
    public void setSkillsOther(String skillsOther) { this.skillsOther = skillsOther; }

    public String getExperiencesJson() { return experiencesJson; }
    public void setExperiencesJson(String experiencesJson) { this.experiencesJson = experiencesJson; }

    public String getEducationJson() { return educationJson; }
    public void setEducationJson(String educationJson) { this.educationJson = educationJson; }

    public String getCertificationsJson() { return certificationsJson; }
    public void setCertificationsJson(String certificationsJson) { this.certificationsJson = certificationsJson; }

    public String getProjectsJson() { return projectsJson; }
    public void setProjectsJson(String projectsJson) { this.projectsJson = projectsJson; }

    public String getAttachmentsJson() { return attachmentsJson; }
    public void setAttachmentsJson(String attachmentsJson) { this.attachmentsJson = attachmentsJson; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }

    public Integer getExpectedSalary() { return expectedSalary; }
    public void setExpectedSalary(Integer expectedSalary) { this.expectedSalary = expectedSalary; }

    public String getNoticePeriod() { return noticePeriod; }
    public void setNoticePeriod(String noticePeriod) { this.noticePeriod = noticePeriod; }

    public String getPreferredJobLocation() { return preferredJobLocation; }
    public void setPreferredJobLocation(String preferredJobLocation) { this.preferredJobLocation = preferredJobLocation; }

    public String getJobTypePreference() { return jobTypePreference; }
    public void setJobTypePreference(String jobTypePreference) { this.jobTypePreference = jobTypePreference; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}