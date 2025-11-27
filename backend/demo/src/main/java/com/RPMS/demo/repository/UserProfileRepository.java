package com.RPMS.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.RPMS.demo.model.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
}