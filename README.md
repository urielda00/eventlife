# 🎉 EventLife

EventLife is a full-stack collaborative event planning platform built to help users create events, manage participants, and coordinate the items each participant brings.

The project combines a modern React frontend with a Spring Boot REST API and PostgreSQL database, with a focus on clean architecture, secure authentication, responsive UI, and real-world event management flows.

---

## 👨‍💻 Authors

Built by **Uriel Dahan** and **Yarin Cohen**.

---

## 🚀 Features

### Event Management
- Create and manage events
- Browse available events
- View detailed event information
- Delete events as the event owner
- Join and leave events
- View event participants

### Item Management
- Add items to an event
- Assign items to authenticated users
- View items associated with an event
- Remove items based on ownership and authorization rules

### User Management
- User registration
- User login
- User profile access
- Secure password hashing with BCrypt
- Authenticated user-specific operations

### Security
- Stateless JWT authentication
- HS256 signed tokens
- Spring Security authorization
- Ownership-based access control
- Protected user, event, and item operations
- Exact-origin CORS configuration
- Secure production environment configuration

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM
- TanStack React Query
- Axios
- Styled Components
- Framer Motion
- React Toastify
- React Icons
- date-fns

### Backend

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Validation
- Spring Boot Actuator
- Springdoc OpenAPI / Swagger
- JWT Authentication
- BCrypt
- Maven

### Database

- PostgreSQL 17
- Flyway Database Migrations
- Hibernate / JPA

### Infrastructure

- Docker
- Docker Compose
- Netlify
- Cloudflare Tunnel

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │    Vite + React     │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │ Spring Boot Backend │
                    │  Security + JPA     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL 17    │
                    │  Flyway Migrations  │
                    └─────────────────────┘
```

The frontend communicates with the backend through a REST API.

The backend handles authentication, authorization, application logic, persistence, and validation, while PostgreSQL stores users, events, participants, and event items.

---

## 🔐 Authentication & Authorization

EventLife uses stateless Bearer-token authentication.

After login, the backend generates a signed JWT. The frontend sends the token with authenticated API requests:

```http
Authorization: Bearer <token>
```

The backend validates:

- JWT signature
- Token expiration
- User existence
- Authenticated identity
- Resource ownership
- Operation-specific permissions

Authorization is enforced on the server rather than trusting user IDs supplied by the client.

Examples:

- Users can access protected operations only as themselves
- Only an event owner can delete the event
- Joining or leaving an event applies to the authenticated user
- Item operations validate both the authenticated user and the associated event
- Item deletion is limited to the item creator or event owner

---

## 🗄️ Database

EventLife uses PostgreSQL 17.

Database schema changes are managed using Flyway migrations.

On application startup:

1. Flyway applies pending migrations
2. Hibernate validates that the database schema matches the application entities
3. The application starts only when the expected schema is available

Production uses:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

This prevents Hibernate from silently modifying the production database schema.

---

## 📂 Repository Structure

EventLife is maintained as a monorepo containing both the frontend and backend:

```text
eventlife/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── pom.xml
│   ├── Dockerfile
│   └── .env.example
│
├── compose.yaml
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Local Development

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Run the application using Maven:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend can be configured using:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🐳 Docker

The production backend and PostgreSQL database can be started using Docker Compose.

Create the production environment file from:

```text
.env.example
```

Then run:

```bash
docker compose up -d --build
```

The Compose stack contains:

- Spring Boot backend
- PostgreSQL 17 database
- Persistent PostgreSQL storage
- Health checks
- Internal Docker networking

The database is not exposed publicly.

---

## ❤️ Health Check

The backend exposes a Spring Boot Actuator health endpoint:

```http
GET /actuator/health
```

A healthy application returns:

```json
{
  "status": "UP"
}
```

The database health is included in the application's overall health state.

---

## 📜 API Documentation

The backend includes interactive API documentation using Springdoc OpenAPI and Swagger UI.

The API includes endpoints for:

- Authentication
- Users
- Events
- Participants
- Items

Swagger can also be used during development to inspect and test API requests.

---

## 🌐 Deployment

The frontend and backend are deployed independently.

### Frontend

The React application is designed to be deployed through Netlify.

### Backend

The Spring Boot API and PostgreSQL database run as Docker containers.

Production traffic follows this general architecture:

```text
Netlify Frontend
       │
       ▼
Public API Endpoint
       │
       ▼
Spring Boot Container
       │
       ▼
PostgreSQL Container
```

The current deployment uses Cloudflare Tunnel as the secure ingress layer for the backend, while the database remains accessible only inside the Docker network.

The deployment infrastructure is intentionally separated from the application architecture so the backend can later be moved to another hosting provider without requiring changes to the core application.

---

## 🧪 Testing

The backend includes automated tests covering application behavior and security-sensitive flows.

The project validates:

- Application startup
- Authentication
- Authorization
- Database integration
- User operations
- Event operations
- Participant operations
- Item operations
- PostgreSQL compatibility

---

## 📚 Project History

EventLife originally used separate repositories for the frontend and backend.

The project was later consolidated into this monorepo to simplify development, deployment, documentation, and version management.

Previous repositories:

- Backend: https://github.com/EventLife123/EventLife
- Frontend: https://github.com/EventLife123/FrontEnd

This repository is now the primary version of the project.

---

## 📌 Project Goals

EventLife was built as a full-stack project focused on applying practical software engineering concepts including:

- REST API design
- Client-server architecture
- Authentication and authorization
- Relational database design
- Database migrations
- Component-based frontend development
- State and API management
- Containerization
- Production configuration
- Secure deployment practices

---

© Uriel Dahan & Yarin Cohen