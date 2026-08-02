package com.RPMS.demo.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class AsyncConfigTest {

    @Test
    void testAsyncConfigLoads() {
        AsyncConfig asyncConfig = new AsyncConfig();
        assertNotNull(asyncConfig, "AsyncConfig should be instantiated");
    }
}
