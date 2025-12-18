package com.RPMS.demo.repository;

import com.RPMS.demo.model.InterviewPanel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewPanelRepository extends JpaRepository<InterviewPanel, Long> {
    List<InterviewPanel> findByApplicationId(Integer applicationId);

    void deleteByApplicationId(Integer applicationId);
}
