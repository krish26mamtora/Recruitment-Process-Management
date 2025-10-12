package com.RPMS.demo.repository;

import com.RPMS.demo.model.JobSkill;
import com.RPMS.demo.model.JobSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobSkillRepository extends JpaRepository<JobSkill, JobSkillId> {
}
