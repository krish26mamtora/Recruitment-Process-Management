package com.RPMS.demo.model;

import java.io.Serializable;
import java.util.Objects;

public class JobSkillId implements Serializable {

    private Integer job;
    private Integer skill;

    public JobSkillId() {
    }

    public JobSkillId(Integer job, Integer skill) {
        this.job = job;
        this.skill = skill;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof JobSkillId))
            return false;
        JobSkillId that = (JobSkillId) o;
        return Objects.equals(job, that.job) &&
                Objects.equals(skill, that.skill);
    }

    @Override
    public int hashCode() {
        return Objects.hash(job, skill);
    }
}
