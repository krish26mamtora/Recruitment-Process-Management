package com.RPMS.demo.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class WebConfigTest {

    @Test
    void testWebConfigLoads() {
        WebConfig webConfig = new WebConfig();
        WebMvcConfigurer configurer = webConfig.corsConfigurer();
        assertNotNull(webConfig, "WebConfig should be instantiated");
        assertNotNull(configurer, "CorsConfigurer should be instantiated");
    }
}
