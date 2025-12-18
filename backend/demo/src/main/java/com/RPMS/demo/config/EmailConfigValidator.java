package com.RPMS.demo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class EmailConfigValidator {
    private static final Logger log = LoggerFactory.getLogger(EmailConfigValidator.class);

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @EventListener(ApplicationReadyEvent.class)
    public void validateEmailConfig() {
        log.info("=== Email Configuration Status ===");
        log.info("Mail Host: {}", mailHost);
        log.info("Mail Username: {}", mailUsername);

        if (mailUsername == null || mailUsername.isEmpty()) {
            log.warn("⚠️  Email username is not configured. Email notifications will fail.");
            log.warn("⚠️  Please configure spring.mail.username and spring.mail.password in application.properties");
        } else {
            log.info("✓ Email configuration found");
            log.warn("⚠️  Note: Gmail requires App Passwords. Regular passwords won't work.");
            log.warn("⚠️  Generate an App Password at: https://myaccount.google.com/apppasswords");
        }
        log.info("==================================");
    }
}
