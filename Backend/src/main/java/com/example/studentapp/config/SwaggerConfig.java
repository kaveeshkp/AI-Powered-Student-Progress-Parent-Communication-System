package com.example.studentapp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI configuration for comprehensive API documentation.
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI studentAppOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Student Application API")
                .version("1.0.0")
                .description("AI-Powered Student Progress & Parent Communication System")
                .contact(new Contact()
                    .name("Development Team")
                    .email("dev@studentapp.com")
                    .url("https://github.com/studentapp")))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT authentication token. Obtain via /api/v1/auth/login")))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
