package com.RPMS.demo.dto;

import java.util.Set;

public class LoginResponse {
    private boolean success;
    private String message;
    private String fullName;
    private Set<String> roles;
    private Long userId;
    private String email;

    public LoginResponse(boolean success, String message, String fullName, Set<String> roles, Long userId, String email) {
        this.success = success;
        this.message = message;
        this.fullName = fullName;
        this.roles = roles;
        this.userId = userId;
        this.email = email;
    }

    // Getters & Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
