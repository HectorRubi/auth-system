# Auth System

> A small REST API implementing authentication (access + refresh tokens) and basic user management from scratch built with NestJS. It implements jwt directly without any third party library with the main goal to deep in learning of JWT, encryption, hashing and all topics needed for a modern authentication feature.

## About

This repository contains a simple authentication system demonstrating an Access Token + Refresh Token flow. It covers login, token refresh, logout and user management endpoints.

## Features ✅

- Login with credentials and receive Access + Refresh tokens
- Refresh tokens endpoint to get new access tokens
- Logout to revoke the refresh token
- Basic user creation and listing endpoints

## Tech stack 🔧

- Node.js
- NestJS
- TypeScript
- JWT
- PostgreSQL
- Docker

## Getting started 🚀

### Prerequisites

- Node.js (>= 18)
- npm (>= 9)

### Environment variables

Create a `.env` file at the project root or use your environment manager. Example variables used by this project:

```
PG_HOST=your_database_port
PG_PORT=your_database_port
PG_USER=your_database_user
PG_PASSWORD=your_database_password
PG_DATABASE=your_database_name
JWT_SECRET=your_jwt_secret
```

> 💡 Keep secrets out of source control and use a secrets manager for production.

### Run

```bash
docker compose up
```

## API 📡

Base URL: `http://localhost:3000`

### Auth endpoints

- POST /auth/login
  - Body: `{ "username": "user", "password": "password" }`
  - Returns: `{ "accessToken": "...", "refreshToken": "..." }`

- POST /auth/refresh-token
  - Body: `{ "refreshToken": "..." }`
  - Returns: `{ "accessToken": "..." }`

- POST /auth/logout
  - Body: `{ "refreshToken": "..." }`
  - Returns: 204 No Content (or 200 with success message)

### User endpoints

- POST /users
  - Body: `{ "username": "...", "password": "..." }`
  - Creates a user

- GET /users
  - Returns a list of users (protected endpoint in some implementations)

> Example cURL (login):
>
> ```bash
> curl -X POST http://localhost:3000/auth/login \
>  -H "Content-Type: application/json" \
>  -d '{"username":"admin","password":"changeme"}'
> ```

## Authentication flow 🔁

1. User creation with a post to `/users` with the user data.
1. Client posts credentials to `/auth/login` and receives an Access Token and a Refresh Token.
1. Client sends Access Token in `Authorization: Bearer <token>` to access protected endpoints.
1. When the Access Token expires, client posts the Refresh Token to `/auth/refresh` to obtain a new Access Token.
1. When user logs out, the Refresh Token is revoked (or removed server-side) via `/auth/logout`.

## Contributing 🤝

Contributions are welcome. Please open an issue to discuss changes and submit pull requests with clear descriptions and tests when applicable.

## License ⚖️

This project is MIT licensed. See the `LICENSE` file or the upstream Nest license reference.
