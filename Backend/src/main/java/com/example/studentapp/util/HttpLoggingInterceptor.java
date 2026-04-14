package com.example.studentapp.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;

/**
 * HTTP Request/Response logging interceptor.
 * Logs all incoming requests and outgoing responses for debugging and monitoring.
 */
@Slf4j
@Component
public class HttpLoggingInterceptor implements HandlerInterceptor {

    private static final String REQUEST_ID = "X-Request-ID";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestId = UUID.randomUUID().toString();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String ipAddress = getClientIpAddress(request);

        // Store request ID in request for later use
        request.setAttribute(REQUEST_ID, requestId);

        log.info("HTTP_REQUEST | id={} | method={} | uri={} | query={} | ip={} | timestamp={}", 
            requestId, method, uri, queryString != null ? queryString : "NONE", 
            ipAddress, System.currentTimeMillis());

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                               Object handler, Exception ex) throws Exception {
        String requestId = (String) request.getAttribute(REQUEST_ID);
        String method = request.getMethod();
        String uri = request.getRequestURI();
        int status = response.getStatus();
        String contentType = response.getContentType();

        if (ex != null) {
            log.error("HTTP_ERROR | id={} | method={} | uri={} | status={} | error={}", 
                requestId, method, uri, status, ex.getMessage());
        } else {
            log.info("HTTP_RESPONSE | id={} | method={} | uri={} | status={} | contentType={} | timestamp={}", 
                requestId, method, uri, status, contentType != null ? contentType : "UNKNOWN", 
                System.currentTimeMillis());
        }

        // Log warnings for 4xx and errors for 5xx
        if (status >= 400 && status < 500) {
            log.warn("HTTP_CLIENT_ERROR | id={} | method={} | uri={} | status={}", 
                requestId, method, uri, status);
        } else if (status >= 500) {
            log.error("HTTP_SERVER_ERROR | id={} | method={} | uri={} | status={}", 
                requestId, method, uri, status);
        }
    }

    /**
     * Retrieves the client IP address from the request.
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}
