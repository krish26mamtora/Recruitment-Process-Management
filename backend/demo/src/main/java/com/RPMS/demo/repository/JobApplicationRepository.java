package com.RPMS.demo.repository;

import com.RPMS.demo.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {

    // Prefer derived query on exposed FK column
    List<JobApplication> findByJobIdFk(Integer jobIdFk);

    List<JobApplication> findByCandidate_UserId(Long candidateId);

}
