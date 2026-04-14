package com.example.studentapp.config;

import com.example.studentapp.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration for the application.
 * 
 * Features:
 * - JWT authentication via JwtAuthenticationFilter
 * - Rate limiting on auth endpoints (Bucket4j)
 * - HTTPS/TLS enforcement (configurable)
 * - CSRF disabled (stateless JWT auth)
 * - Stateless session management
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final RateLimitingFilter rateLimitingFilter;
    private final SecurityProperties securityProperties;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, 
                         UserDetailsService userDetailsService,
                         RateLimitingFilter rateLimitingFilter,
                         SecurityProperties securityProperties) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
        this.rateLimitingFilter = rateLimitingFilter;
        this.securityProperties = securityProperties;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/health").permitAll()
                        .anyRequest().authenticated()
                );
        
        // Add HTTPS enforcement if enabled in production
        if (securityProperties.isEnforceHttps()) {
            http.requiresChannel(channel -> channel
                    .anyRequest()
                    .requiresSecure()
            );
        }
        
        // Add HSTS header if enabled
        if (securityProperties.isEnableHsts()) {
            http.headers(headers -> headers
                    .httpStrictTransportSecurity()
                    .maxAgeInSeconds(securityProperties.getHstsMaxAge())
                    .includeSubDomains(securityProperties.isHstsIncludeSubdomains())
            );
        }
        
        // Add rate limiting filter before authentication
        http.addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class);
        
        // Add JWT filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
