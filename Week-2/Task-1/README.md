# User Management Service

A production-ready REST API for user management, built with Node.js, Express, TypeScript, PostgreSQL (via Prisma ORM), JWT authentication, and Swagger documentation.

---

## Features

- User CRUD (Create, Read, Update, Delete)
- JWT-based authentication
- Input validation and error handling
- Swagger (OpenAPI) documentation
- Unit tests with Jest
- Environment-based configuration

---

## Getting Started

### 1. Clone the repository

```bash
# Clone this repo and cd into it
cd Task-1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/userdb
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 4. Set up the database

- Update `DATABASE_URL` in `.env` as needed.
- Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

- Generate the Prisma client:

```bash
npx prisma generate
```

### 5. Start the server

```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

---

## API Documentation

Interactive API docs are available at:

```
http://localhost:3000/api-docs
```

---

## Project Structure

```
Task-1/
  src/
    controllers/   # Route handlers
    middleware/     # Auth and error middleware
    models/         # TypeScript models
    routes/         # Express route definitions
    services/       # Business logic
    utils/          # Utility functions (hashing, JWT, etc.)
    tests/          # Unit tests
  prisma/           # Prisma schema and migrations
  docs/             # Project documentation
```

---

## Scripts

- `npm run dev` — Start in development mode (with nodemon)
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Run compiled app
- `npm test` — Run unit tests

---

## Testing

Run all tests with:

```bash
npm test
```

---

## Common Issues

See [docs/issues-and-solutions.md](docs/issues-and-solutions.md) for troubleshooting.

---

## License

MIT
