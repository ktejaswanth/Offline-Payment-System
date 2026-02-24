# Use official Java image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Build the project
RUN ./mvnw clean package -DskipTests

# Expose port (Render provides PORT env variable)
EXPOSE 8080

# Run the jar
CMD ["sh", "-c", "java -Dserver.port=$PORT -jar target/*.jar"]
