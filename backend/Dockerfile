# syntax=docker/dockerfile:1
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace

# Use the Maven version pinned by the project wrapper.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src/ src/
RUN --mount=type=cache,target=/root/.m2 \
    chmod +x mvnw && ./mvnw -B -ntp clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine AS runtime
RUN addgroup -S eventlife && adduser -S -G eventlife eventlife
WORKDIR /app
COPY --from=build --chown=eventlife:eventlife /workspace/target/EventLife-0.0.1-SNAPSHOT.jar app.jar

USER eventlife:eventlife
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
