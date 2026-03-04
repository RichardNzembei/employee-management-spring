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

The server port may be changed here to avoid conflicts. The frontend expects the backend at `http://localhost:8080/api` by default; update `frontend/src/lib/api.ts` if the port differs.

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

## Notes

- The frontend uses modals for success messages and confirms, and features search/filtering.
- All sensitive credentials live in `.env`; make sure not to commit it.
- To run on a different port, update `.env` and the `employeeApi.baseURL` in `frontend/src/lib/api.ts`.
- When editing the `.env` file, restart the backend for changes to take effect.

---

## License

MIT (or as appropriate)
