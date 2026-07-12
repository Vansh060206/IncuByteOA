# AutoVault - Car Dealership Inventory System

AutoVault is a modern, full-stack application built for car dealerships to manage their vehicle showrooms and showrooms inventory. It features token-based authentication, administrative inventory controls (create, edit, delete, and restock vehicles), and customer operations (vehicle catalog search and automated purchases).

This project is built using a Test-Driven Development (TDD) approach, featuring robust integration tests and automated GitHub Actions CI/CD workflows.

---

## Technical Stack

* **Monorepo Structure**: Managed via npm workspaces.
* **Backend**: Node.js, TypeScript, Express, Prisma ORM, PostgreSQL (Postgres schema config).
* **Frontend**: React (v19), TypeScript, Vite, Vanilla CSS design system.
* **Testing & CI/CD**: Jest, Supertest, GitHub Actions.

---

## Core Features

1. **Authentication (JWT)**:
   * Secure user registration and login endpoints.
   * Session-based routes protection via authorization middleware.
2. **Vehicles API & Inventory**:
   * **Showroom Search**: Filter vehicles dynamically by make, model, category, or price range.
   * **Purchase System**: Instantly buy available vehicles, decrementing stock units (blocks purchase if stock is 0).
   * **Restock (Admin Only)**: Replenish inventory quantity (guarded by admin guards).
   * **CRUD (Admin Only)**: Add, modify, or remove vehicles from the catalog.

---

## Git Commit History & TDD Workflow

This project was built following strict TDD guidelines. Changes are split into logical, step-by-step commits following a clear "Red-Green-Refactor" cadence:
* **Test cases written first** to establish requirements and verify the expected failures (Red).
* **Implementation logic added** to fulfill requests (Green).
* **Types and architecture updated** to clean up type structures (Refactor).

---

## Local Setup & Installation

Follow these steps to run the application locally:

### 1. Clone the repository
```bash
git clone https://github.com/Vansh060206/IncuByteOA.git
cd IncuByteOA
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend` folder:
```bash
# backend/.env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autovault?schema=public"
JWT_SECRET="generate-a-secure-random-secret-key-at-least-32-chars"
JWT_EXPIRES_IN="7d"
```

### 3. Install Dependencies
Run from the root directory to install and link workspace dependencies automatically:
```bash
npm install
```

### 4. Generate Prisma Client
```bash
npx prisma generate --workspace=backend
```

### 5. Running the Application
To run both the frontend and backend local servers concurrently:
* Run the Backend API (on `http://localhost:5000`):
  ```bash
  npm run dev --workspace=backend
  ```
* Run the Frontend application (on `http://localhost:5173`):
  ```bash
  npm run dev --workspace=frontend
  ```

---

## Testing & Test Report

All APIs, database handlers, and middleware structures are fully validated. You can execute the test suites locally using the following command:

```bash
npm run test:backend
```

### Test Suite Results:
* **Total test suites**: 3 passed, 3 total
* **Total integration tests**: 15 passed, 15 total

```text
PASS tests/integration/health.test.ts
  GET /api/v1/health
    √ should return 200 and healthy status when DB is reachable (55 ms)
    √ should return 500 when database connection fails (9 ms)

PASS tests/integration/vehicle.test.ts
  Vehicle Integration Tests
    POST /api/v1/vehicles
      √ should create a vehicle successfully (85 ms)
      √ should fail validation if fields are missing (10 ms)
      √ should fail if license plate is duplicate (10 ms)
    GET /api/v1/vehicles
      √ should list only the user's vehicles for USER role (7 ms)
    GET /api/v1/vehicles/search
      √ should search vehicles successfully (7 ms)
    POST /api/v1/vehicles/:id/purchase
      √ should purchase a vehicle successfully and decrement stock (7 ms)
      √ should fail purchase if vehicle is out of stock (6 ms)
    POST /api/v1/vehicles/:id/restock
      √ should allow admin to restock quantity (8 ms)
      √ should reject restock for non-admin user (10 ms)

PASS tests/integration/auth.test.ts
  Auth Integration Tests
    POST /api/v1/auth/register
      √ should register a new user successfully (435 ms)
      √ should return 400 when email is already registered (9 ms)
    POST /api/v1/auth/login
      √ should log in existing user with correct credentials (10 ms)
      √ should return 401 on incorrect password (6 ms)
```

---

## My AI Usage

### 1. AI Tools Used
* **Gemini-Antigravity (IDE Coding Assistant)**: Used for scaffolding folder structures, writing boilerplate schemas, creating controller routes, and formulating test blocks.

### 2. Implementation Methodology
* **Code Scaffolding**: I asked Gemini to build the workspace layout for Vite React + TypeScript, generating a clean project configuration ready for npm workspace linking.
* **TDD & Tests Drafting**: Gemini wrote initial Jest/Supertest mocks for database interactions. I reviewed and manually refined the assert validations to verify status codes and HTTP headers.
* **Attribution**: Every commit where Gemini-Antigravity contributed has been correctly attributed using Git co-author trailers (`Co-authored-by: Gemini-Antigravity <antigravity@users.noreply.github.com>`).

### 3. Reflection
Integrating AI co-authorship into the Git workflow significantly increased efficiency when creating boilerplate routing and controller structures. It allowed me to focus on refining business logic constraints and verifying strict API validation rules, creating a robust and clean inventory management application.
