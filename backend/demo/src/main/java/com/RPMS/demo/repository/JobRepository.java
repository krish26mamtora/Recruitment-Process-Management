package com.RPMS.demo.repository;

import com.RPMS.demo.model.Job;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByStatus(String status);

    List<Job> findByTitleContainingIgnoreCase(String keyword);
}
