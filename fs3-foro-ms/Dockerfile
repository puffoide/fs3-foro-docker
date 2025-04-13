FROM eclipse-temurin:22-jdk-alpine
WORKDIR /app
COPY target/foro-0.0.1-SNAPSHOT.jar app.jar
COPY Wallet_JZJTIXGSTLVPJ05V /app/Wallet_JZJTIXGSTLVPJ05V
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]