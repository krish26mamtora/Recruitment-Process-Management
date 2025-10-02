package com.RPMS.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/")
    public String hels() {
        return "Hello from Smart Tomcat!";
    }

    @GetMapping("/hu")
    public String hello() {
        return "Hello from Smart Tomcat!";
    }
}
