package com.RPMS.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "candidate_resume_parsed", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "job_application_id" })
})
public class CandidateResumeParsed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_application_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private JobApplication jobApplication;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "extracted_skills", columnDefinition = "TEXT[]")
    private List<String> extractedSkills;

    @Column(name = "extracted_experience_years")
    private Double extractedExperienceYears;

    @Column(name = "parsed_at", nullable = false)
    private Instant parsedAt = Instant.now();

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

    public List<String> getExtractedSkills() {
        return extractedSkills;
    }

    public void setExtractedSkills(List<String> extractedSkills) {
        this.extractedSkills = extractedSkills;
    }

    public Double getExtractedExperienceYears() {
        return extractedExperienceYears;
    }

    public void setExtractedExperienceYears(Double extractedExperienceYears) {
        this.extractedExperienceYears = extractedExperienceYears;
    }

    public Instant getParsedAt() {
        return parsedAt;
    }

    public void setParsedAt(Instant parsedAt) {
        this.parsedAt = parsedAt;
    }
}
