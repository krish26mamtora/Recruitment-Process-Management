package com.RPMS.demo.service;

import com.RPMS.demo.model.Job;
import java.util.List;
import java.util.Optional;

public interface JobService {
    List<Job> getAllJobs();

    Optional<Job> getJobById(Integer id);

    Job createJob(Job job);

    Job updateJob(Integer id, Job jobDetails);

    void deleteJob(Integer id);

    List<Job> searchJobs(String keyword);
}
