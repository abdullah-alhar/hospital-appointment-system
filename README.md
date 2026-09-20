# Hospital Appointment System

A web application for booking and managing hospital appointments. Patients can book a visit with a doctor, and staff can manage schedules and records. It is built with Spring Boot and uses Microsoft SQL Server running in Docker.

## Features

- Patient registration and login
- Book, view, reschedule, and cancel appointments
- Doctor profiles with specialization and available time slots
- Admin panel to manage doctors, patients, and appointments
- Prevents double booking of the same time slot
- Appointment status tracking (Pending, Confirmed, Completed, Cancelled)

## Tech Stack

| Part | Technology |
|------|------------|
| Backend | Java 17, Spring Boot |
| Database | Microsoft SQL Server (Docker) |
| Data Access | Spring Data JPA (Hibernate) |
| Build Tool | Maven |
| Security | Spring Security |

## Prerequisites

Make sure you have these installed:

- Java JDK 17 or newer
- Maven 3.8 or newer
- Docker Desktop
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Abdullah-alhar/hospital-appointment-system.git
cd hospital-appointment-system
```

### 2. Start the database with Docker

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name hospital-sql \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Then create the database:

```bash
docker exec -it hospital-sql /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "YourStrong@Passw0rd" -C \
  -Q "CREATE DATABASE hospital_db"
```

### 3. Configure the application

Open `src/main/resources/application.properties` and set:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=hospital_db;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourStrong@Passw0rd
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> **Note:** Do not upload your real password to GitHub. Use environment variables for real projects.

### 4. Run the application

```bash
mvn spring-boot:run
```

The app will start at `http://localhost:8080`.

## Project Structure
