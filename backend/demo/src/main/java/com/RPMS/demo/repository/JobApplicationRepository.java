package com.RPMS.demo.repository;

import com.RPMS.demo.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJob_JobId(Integer jobId);

    List<JobApplication> findByCandidate_UserId(Long candidateId);

}
