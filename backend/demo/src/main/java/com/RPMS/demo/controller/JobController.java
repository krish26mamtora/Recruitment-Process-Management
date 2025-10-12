package com.RPMS.demo.controller;

import com.RPMS.demo.model.Job;
import com.RPMS.demo.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Integer id) {
        return jobRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Integer id, @RequestBody Job updatedJob) {
        return jobRepository.findById(id).map(job -> {
            job.setTitle(updatedJob.getTitle());
            job.setDescription(updatedJob.getDescription());
            job.setStatus(updatedJob.getStatus());
            job.setMinExperienceYears(updatedJob.getMinExperienceYears());
            job.setReasonClosed(updatedJob.getReasonClosed());
            return jobRepository.save(job);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Integer id) {
        jobRepository.deleteById(id);
    }
}
