# Employee Management

This repository contains a simple employee management application with a **Spring Boot backend** and a **Next.js frontend**. The backend exposes a REST API backed by PostgreSQL, and the frontend is a React-based admin UI.

---

## Architecture

- **Backend** (`/backend`)
  - Spring Boot 3.5 application
  - JPA/Hibernate for persistence
  - PostgreSQL as the database
  - Exposes CRUD endpoints under `/api/employees`
  - Configuration is driven by environment variables (via `.env` file)

- **Frontend** (`/frontend`)
  - Next.js (app router) with React components
  - Uses `axios` to call the backend API
  - Pages for listing, adding, editing and searching employees
  - TailwindCSS for styling

---

## Prerequisites

- Java 17+ and Maven (for backend)
- Node.js 18+ and npm/yarn (for frontend)
- PostgreSQL running locally or accessible by URL
- `lsof`/`netstat` or similar to check ports

---

## Environment configuration

The backend reads its configuration from a `.env` file located at `/backend/.env`. This file is ignored by Git.

```properties
SPRING_APPLICATION_NAME=employee-management
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/employee_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL=true
SERVER_PORT=8080
```

The server port may be changed here to avoid conflicts. The frontend reads `NEXT_PUBLIC_API_URL` for the backend endpoint, defaulting to `http://localhost:8080/api`. You can export this variable in a `.env.local` file inside `frontend` or set it when starting the dev server. Example:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

The code falls back to the default if the variable is not set.

---

## Backend

The backend is a Spring Boot application. You can build, test and run it with Maven.

### Testing

Automated tests are located in `backend/src/test/java` and include an integration-style
`EmployeeManagementApplicationTests` class. They use a live PostgreSQL connection and are
run with Flyway disabled to avoid version mismatches.

```bash
cd backend
mvn test          # compile and execute tests
```

### Linting / formatting

Java code follows standard conventions; a formatter (e.g. IntelliJ defaults) is recommended.

---

## Running the backend

1. Ensure PostgreSQL is running and the database (`employee_db`) exists.
2. Navigate to `backend`:
   ```bash
   cd backend
   ```
3. Build and run:
   ```bash
   mvn clean spring-boot:run
   ```
   or package and start:
   ```bash
   mvn clean package
   java -jar target/employee-management-0.0.1-SNAPSHOT.jar
   ```

The application will auto-create tables (DDL `update`) and listen on the port configured in `.env`.

---

## Frontend

The frontend is a Next.js application using React Query for data fetching.

### Development

```bash
cd frontend
npm install          # or yarn
npm run dev          # start dev server at http://localhost:3000
```

The `src/hooks/useEmployees.ts` hook centralizes API access; the React Query cache
is invalidated automatically when employees are added/updated/deleted.

### Linting & Formatting

ESLint is enabled via `.eslintrc.json` (extends `next/core-web-vitals`). Run:

```bash
cd frontend
npm run lint -- --fix
```

A Prettier configuration can be added if desired; the codebase currently strips comments
and adheres to the existing style.

---

## Running the frontend

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or yarn
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database schema

A simple `Employee` entity with fields:

- `firstName`, `lastName`
- `email` (unique)
- `employmentNumber`
- `position` (`JUNIOR_DEVELOPER` or `SENIOR_DEVELOPER`)
- `salary`, `employmentDate`

JPA manages the schema, so no manual migrations are required for development.

---

## Continuous Integration (CI)

A basic GitHub Actions workflow (see `.github/workflows/ci.yml`) builds and tests
both backend and frontend on every push. It installs Java and Node.js, runs `mvn test`,
and executes `npm install && npm run lint && npm run build` for the frontend.

---

## Notes

- The frontend uses modals for success messages and confirms, and features search/filtering.
- All sensitive credentials live in `.env`; make sure not to commit it.
- To run on a different port, update `.env` and the `employeeApi.baseURL` in `frontend/src/lib/api.ts`.
- When editing the `.env` file, restart the backend for changes to take effect.

---

## License

MIT (or as appropriate)
