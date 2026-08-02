package com.RPMS.demo.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.web.SecurityFilterChain;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class SecurityConfigTest {

    @Test
    void testSecurityConfigLoads() throws Exception {
        SecurityConfig securityConfig = new SecurityConfig();
        assertNotNull(securityConfig, "SecurityConfig should be instantiated");
    }
}
