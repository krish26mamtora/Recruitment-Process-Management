package com.RPMS.demo;

import java.util.HashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(DemoApplication.class);
		Map<String, Object> defaults = new HashMap<>();
		defaults.put("spring.datasource.url", getPropertyOrEnv("spring.datasource.url", "SPRING_DATASOURCE_URL",
				"jdbc:h2:mem:demo;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"));
		defaults.put("spring.datasource.username",
				getPropertyOrEnv("spring.datasource.username", "SPRING_DATASOURCE_USERNAME", "sa"));
		defaults.put("spring.datasource.password",
				getPropertyOrEnv("spring.datasource.password", "SPRING_DATASOURCE_PASSWORD", ""));
		defaults.put("spring.jpa.hibernate.ddl-auto",
				getPropertyOrEnv("spring.jpa.hibernate.ddl-auto", "SPRING_JPA_HIBERNATE_DDL_AUTO", "update"));
		app.setDefaultProperties(defaults);
		app.run(args);
	}

	private static String getPropertyOrEnv(String systemPropertyKey, String envKey, String defaultValue) {
		String prop = System.getProperty(systemPropertyKey);
		if (prop != null && !prop.isBlank()) {
			return prop;
		}
		String env = System.getenv(envKey);
		if (env != null && !env.isBlank()) {
			return env;
		}
		return defaultValue;
	}

}
