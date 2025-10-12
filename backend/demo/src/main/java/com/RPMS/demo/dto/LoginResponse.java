package com.RPMS.demo.dto;

import java.util.Set;

public class LoginResponse {
    private boolean success;
    private String message;
    private String fullName;
    private Set<String> roles;

    public LoginResponse(boolean success, String message, String fullName, Set<String> roles) {
        this.success = success;
        this.message = message;
        this.fullName = fullName;
        this.roles = roles;
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
}
