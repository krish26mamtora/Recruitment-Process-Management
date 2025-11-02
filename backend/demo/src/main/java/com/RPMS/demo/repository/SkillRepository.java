package com.RPMS.demo.repository;

import com.RPMS.demo.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Integer> {
    boolean existsBySkillName(String skillName);

}
