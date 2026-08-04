# Course & User Management API

A RESTful API built with **Node.js** and **Express** for managing courses, student enrollments, and user authentication. Designed following the **MVC pattern** coupled with a **Service layer** for scalable business logic.

## Features

- Authentication & authorization (JWT-based)
- Request validation (express-validator)
- Modular architecture (routes → controllers → services → models)
- Containerized environment (Docker Compose)

## Tech Stack

| Layer            | Technology          |
| ---------------- | ------------------- |
| Runtime          | Node.js 18          |
| Framework        | Express 5           |
| Package manager  | pnpm                |
| Database         | MySQL 8.0           |
| ORM              | Sequelize 6         |
| Containerization | Docker / Compose    |
| Security         | bcrypt, JWT, CORS   |

## Project Structure

```
backend/
├── index.js                     # Server entry point
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example                 # Environment variables template
└── src/
    ├── app.js                   # Express app & route mounting
    ├── config/
    │   ├── auth.config.js       # JWT / bcrypt configuration
    │   └── db.config.js         # Sequelize / MySQL connection
    ├── controllers/             # Request handling layer
    │   ├── assignment.controller.js
    │   ├── auth.controller.js
    │   ├── course.controller.js
    │   └── user.controller.js
    ├── middlewares/
    │   ├── admin.middleware.js  # Role-based access control
    │   ├── auth.middleware.js   # JWT verification
    │   ├── errorHandler.js      # Central error handler
    │   ├── owner.middleware.js  # Owner-or-admin guard
    │   └── validate.js          # Validation result handler
    ├── models/                  # Sequelize models & associations
    │   ├── assignments.model.js
    │   ├── course.model.js
    │   ├── index.models.js
    │   └── user.model.js
    ├── routes/                  # API route definitions
    │   ├── assignment.routes.js
    │   ├── auth.routes.js
    │   ├── course.routers.js
    │   └── user.routes.js
    ├── services/                # Business logic layer
    │   ├── assignment.service.js
    │   ├── auth.service.js
    │   ├── course.service.js
    │   └── user.service.js
    ├── utils/
    │   └── errors.js            # Custom error classes
    └── validators/              # express-validator schemas
        ├── assignment.validator.js
        ├── course.validator.js
        └── user.validator.js
```

## Getting Started

### Prerequisites

- **Option 1 (Docker):** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- **Option 2 (Local):** Node.js 18+, [pnpm](https://pnpm.io/installation), and MySQL 8.0

## Environment Variables

Copy `.env.example` to `.env` and adjust the values:

```bash
cp .env.example .env
```

| Variable        | Description                                    | Default                          |
| --------------- | ---------------------------------------------- | -------------------------------- |
| `PORT`          | Port where the API listens                     | `3000`                           |
| `DB_HOST`       | MySQL host (use `db` with Docker)              | `localhost`                      |
| `DB_NAME`       | Database name                                  | `my_db`                          |
| `DB_USER`       | Database user                                  | `root`                           |
| `DB_PASSWORD`   | Database password                              | `password`                       |
| `JWT_SECRET`    | Secret key for signing JWT tokens              | (set your own in production)     |
| `JWT_EXPIRES_IN`| JWT expiration time                           | `24h`                            |
| `SALT_ROUNDS`   | bcrypt salt rounds for password hashing        | `10`                             |

## Installation & Run

### Option 1: Using Docker (recommended)

Spin up both the MySQL database and the API with a single command:

```bash
docker compose up --build
```

- API available at `http://localhost:3000`
- MySQL exposed on port `3306`
- The database schema is synchronized automatically on startup (`sequelize.sync`)

### Option 2: Local Installation

1. Install dependencies:

```bash
pnpm install
```

2. Create a MySQL database (e.g. `my_db`) and configure your connection in `.env`.

3. Start the API in development mode (with auto-reload):

```bash
pnpm start
```

## Error Response Format

Every error response follows a consistent JSON structure:

```json
{
  "message": "Error description"
}
```

| Status code | Meaning             | Sample message                                                          |
| ----------- | ------------------- | ----------------------------------------------------------------------- |
| 400         | Validation failed   | `Validation failed: Password must be at least 8 characters`             |
| 401         | Unauthorized        | `Email or password incorrect` / `Access denied. No token provided`      |
| 403         | Forbidden           | `Access denied. Admin privileges required`                              |
| 404         | Not found           | `Resource not found`                                                    |
| 409         | Conflict            | `Email is already registered`                                           |
| 500         | Internal server error | `Internal server error`                                                |

Success responses use the same shape but include a `message` plus the payload, e.g.:

```json
{
  "message": "Login successfully",
  "user": { "name": "John Doe", "email": "john@example.com", "role": 2 },
  "token": "<jwt-token>"
}
```

## API Overview

All endpoints (except public ones) require the header `Authorization: Bearer <token>`.

**Roles:** `1` = admin, `2` = student

**Sample request/response:**

Request: `POST /api/auth`

```json
{
  "email": "john@example.com",
  "password": "wrongpassword"
}
```

Response: `401 Unauthorized`

```json
{
  "message": "Email or password incorrect"
}
```

| Method | Endpoint                          | Access                     | Description                          |
| ------ | --------------------------------- | -------------------------- | ------------------------------------ |
| POST   | `/api/auth`                       | Public                     | User login, returns JWT              |
| POST   | `/api/users`                      | Public                     | Register a new user                  |
| GET    | `/api/users`                      | Admin                      | List all users                       |
| GET    | `/api/users/:userId`              | Owner or Admin             | Get a user by ID                     |
| PUT    | `/api/users/profile/:userId`      | Owner or Admin             | Update user profile                  |
| PUT    | `/api/users/:userId`              | Owner or Admin             | Update user password                 |
| DELETE | `/api/users/:userId`              | Owner or Admin             | Delete a user                        |
| POST   | `/api/courses`                    | Admin                      | Create a course                      |
| GET    | `/api/courses`                    | Authenticated              | List all courses                     |
| GET    | `/api/courses/:courseId`          | Authenticated              | Get a course by ID                   |
| PUT    | `/api/courses/:courseId`          | Admin                      | Update a course                      |
| DELETE | `/api/courses/:courseId`          | Admin                      | Delete a course                      |
| POST   | `/api/assignment`                 | Authenticated              | Enroll a user in a course            |
| GET    | `/api/assignment`                 | Authenticated              | List all assignments                 |
| GET    | `/api/assignment/:assignmentId`   | Authenticated              | Get an assignment by ID              |
| PUT    | `/api/assignment/:assignmentId`   | Admin                      | Update an assignment                 |
| DELETE | `/api/assignment/:assignmentId`   | Admin                      | Delete an assignment                 |
