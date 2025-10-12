package com.RPMS.demo.repository;

import com.RPMS.demo.model.Job;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Integer> {
}
