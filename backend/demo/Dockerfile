FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the JAR we just built on your Mac into the container
COPY target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]