FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy built JAR file
COPY Backend/target/studentapp.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "/app/app.jar"]
