package com.RPMS.demo.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class EmailConfigValidatorTest {

    @InjectMocks
    private EmailConfigValidator emailConfigValidator;

    @Test
    void testEmailConfigValidatorLoads() {
        assertNotNull(emailConfigValidator, "EmailConfigValidator should be instantiated");
    }
}
