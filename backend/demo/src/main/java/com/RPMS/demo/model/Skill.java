package com.RPMS.demo.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer skillId;

    @Column(unique = true, nullable = false)
    private String skillName;

    private String description;

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<JobSkill> jobSkills;

    // Getters and Setters
    public Integer getSkillId() { return skillId; }
    public void setSkillId(Integer skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Set<JobSkill> getJobSkills() { return jobSkills; }
    public void setJobSkills(Set<JobSkill> jobSkills) { this.jobSkills = jobSkills; }
}
