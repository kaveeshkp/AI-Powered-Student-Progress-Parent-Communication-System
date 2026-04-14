package com.example.studentapp.config;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Security properties for HTTPS/TLS enforcement and JWT configuration.
 * 
 * To enable in production:
 * - Set ENFORCE_HTTPS=true
 * - Set REQUIRE_SECURE_COOKIES=true
 * - Use strong JWT_SECRET (32+ bytes)
 */
@Getter
@Component
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    /**
     * Enable HTTPS/TLS enforcement
     * Default: false (for development)
     * 
     * In production, set ENFORCE_HTTPS=true to:
     * - Redirect HTTP to HTTPS
     * - Add HSTS headers
     * - Require secure cookies
     */
    private boolean enforceHttps = false;

    /**
     * Require secure cookies (HTTPS only)
     * Default: false
     * 
     * Only for production - causes all cookies to require HTTPS
     */
    private boolean requireSecureCookies = false;

    /**
     * Enable HSTS header (Strict Transport Security)
     * Default: false
     * 
     * Tells browsers to always use HTTPS for this domain
     */
    private boolean enableHsts = false;

    /**
     * HSTS max age in seconds
     * Default: 31536000 (1 year)
     */
    private long hstsMaxAge = 31536000L;

    /**
     * Include subdomains in HSTS policy
     * Default: false
     */
    private boolean hstsIncludeSubdomains = false;

    /**
     * Preload flag for HSTS (adds to preload list)
     * Default: false
     */
    private boolean hstsPreload = false;

    // Setter methods for property binding
    public void setEnforceHttps(boolean enforceHttps) {
        this.enforceHttps = enforceHttps;
    }

    public void setRequireSecureCookies(boolean requireSecureCookies) {
        this.requireSecureCookies = requireSecureCookies;
    }

    public void setEnableHsts(boolean enableHsts) {
        this.enableHsts = enableHsts;
    }

    public void setHstsMaxAge(long hstsMaxAge) {
        this.hstsMaxAge = hstsMaxAge;
    }

    public void setHstsIncludeSubdomains(boolean hstsIncludeSubdomains) {
        this.hstsIncludeSubdomains = hstsIncludeSubdomains;
    }

    public void setHstsPreload(boolean hstsPreload) {
        this.hstsPreload = hstsPreload;
    }
}
