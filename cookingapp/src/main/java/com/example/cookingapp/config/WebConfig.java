// src/main/java/com/example/cookingapp/config/WebConfig.java
package com.example.cookingapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                          // all endpoints
                .allowedOrigins("http://localhost:5173")    // your front‐end origin
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                .allowedHeaders("*")                       // <<<<<< allow Authorization, Content-Type, etc.
                .allowCredentials(true);
    }
}
