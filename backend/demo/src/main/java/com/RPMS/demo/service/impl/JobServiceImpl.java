package com.RPMS.demo.service.impl;

import com.RPMS.demo.model.Job;
import com.RPMS.demo.model.JobSkill;
import com.RPMS.demo.model.Skill;
import com.RPMS.demo.repository.JobRepository;
import com.RPMS.demo.repository.SkillRepository;
import com.RPMS.demo.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public Optional<Job> getJobById(Integer id) {
        return jobRepository.findById(id);
    }

    @Override
    public Job createJob(Job job) {
        java.util.Set<JobSkill> jobSkills = job.getJobSkills();
        if (jobSkills != null && !jobSkills.isEmpty()) {
            java.util.Set<JobSkill> normalized = new java.util.HashSet<>();
            for (JobSkill js : jobSkills) {
                Skill s = js.getSkill();
                if (s == null || s.getSkillId() == null) {
                    continue;
                }
                Skill managed = null;
                try {
                    managed = skillRepository.getReferenceById(s.getSkillId());
                } catch (Exception e) {
                    managed = skillRepository.findById(s.getSkillId()).orElse(null);
                }
                if (managed == null) {
                    continue;
                }
                js.setSkill(managed);
                js.setJob(job);
                normalized.add(js);
            }
            job.setJobSkills(normalized);
        }
        return jobRepository.save(job);
    }

    @Override
    public Job updateJob(Integer id, Job jobDetails) {
        return jobRepository.findById(id).map(job -> {
            job.setTitle(jobDetails.getTitle());
            job.setDescription(jobDetails.getDescription());
            job.setMinExperienceYears(jobDetails.getMinExperienceYears());
            job.setStatus(jobDetails.getStatus());
            job.setReasonClosed(jobDetails.getReasonClosed());
            job.setAssignedRecruiterId(jobDetails.getAssignedRecruiterId());
            job.setClosedAt(jobDetails.getClosedAt());
            return jobRepository.save(job);
        }).orElseThrow(() -> new RuntimeException("Job not found with ID: " + id));
    }

    @Override
    public void deleteJob(Integer id) {
        jobRepository.deleteById(id);
    }

    @Override
    public List<Job> searchJobs(String keyword) {
        return jobRepository.findByTitleContainingIgnoreCase(keyword);
    }
}
