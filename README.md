# 🚗 AutoVault — Car Dealership Fleet & Inventory Console

AutoVault is an award-winning, enterprise-grade, full-stack vehicle inventory and sales ledger ecosystem. Designed for modern car dealerships, the system features biometric-inspired authorization, real-time stock telemetry, customer checkouts, interactive order ledgers, and a comprehensive administrative operations cockpit.

Built under strict Test-Driven Development (TDD) guidelines, AutoVault features 100% passing test suites and automated GitHub Actions CI/CD pipelines.

---

## 🚀 Live Production Links

| Component | Platform | Deployment URL |
| :--- | :--- | :--- |
| **Frontend Web App** | **Vercel** | 🔗 [https://incu-byte-oa-frontend.vercel.app](https://incu-byte-oa-frontend.vercel.app) |
| **Backend REST API** | **Render** | 🔗 [https://incubyteoa.onrender.com/api/v1](https://incubyteoa.onrender.com/api/v1) |

---

## 🖼️ Application Showcase

<table>
  <tr>
    <td width="50%" align="center">
      <h3>🔐 Registration Portal</h3>
      <img src="./docs/images/register.png" alt="Registration Portal" />
      <p><i>Features glassmorphic fields, auth validation, and premium branding side graphic.</i></p>
    </td>
    <td width="50%" align="center">
      <h3>🏠 Client Dashboard</h3>
      <img src="./docs/images/catalog.png" alt="Client Dashboard" />
      <p><i>Welcome hero banner with quick-search, spec badges, and showroom catalog grids.</i></p>
    </td>
  </tr>
</table>

### 💼 Executive Operations Cockpit
Contains asset valuation, showroom health distribution charts, and replenishment alerts.
![Admin Dashboard Showcase](./docs/images/admin.png)

### 📋 Fleet Inventory Administration
Allows administrators to configure vehicle specifications, edit stock values, and audit live unit stock levels.
![Admin Inventory Showcase](./docs/images/admin_inventory.png)

### 📊 Purchase Ledgers & Receipts
Cross-reference fleet purchases, customer order histories, and ledger receipts.
![Purchase Ledgers Showcase](./docs/images/purchase_ledgers.png)

### 🕒 Activity Log Ledger
Audit trail tracking inventory restocks, brand creations, transaction history, and system status logs.
![Activity Log Showcase](./docs/images/activity_timeline.png)

---

## 🛠️ Technical Stack & Architecture

```mermaid
graph TD
    A[Vercel Frontend: React, Tailwind, Vite] -->|HTTPS Requests / JWT Auth| B[Render Backend: Node.js, Express, TS]
    B -->|Prisma Client v7| C[Supabase PostgreSQL Cloud DB]
    D[GitHub CI/CD Actions] -->|Verification Trigger| B
```

### Core Technologies:
* **Frontend SPA**: React (v19), TypeScript, Vite, Tailwind CSS, TanStack React Query, Axios, Lucide Icons, React Hook Form.
* **Backend API**: Node.js, TypeScript, Express, Prisma ORM, `@prisma/adapter-pg` driver adapter.
* **Database**: PostgreSQL Hosted on Supabase (with transaction pooling via pgBouncer on port `6543`).
* **CI/CD & Testing**: Jest, Supertest, GitHub Actions.

---

## 💎 Key Features

1. **JWT Auth**: Session-based protection, security route guards, and automatic token decoders.
2. **Showroom Search Engine**: Dynamic query filters by make, model, category, minimum price, or maximum price.
3. **Transaction Safeguards**: Atomic updates that automatically decrement vehicle quantity upon checkout, checking for stock availability to prevent overselling.
4. **Supply Replenishment**: Secure restock pathways restricted exclusively to `ADMIN` roles.
5. **Chronological Timelines**: Auto-tracking system logs and showroom actions for audits.

---

## 💻 Local Setup & Development

Follow these steps to spin up the application on your local machine:

### 1. Clone & Install
```bash
git clone https://github.com/Vansh060206/IncuByteOA.git
cd IncuByteOA
npm install
```

### 2. Configure Backend Env
Create a `.env` file in the `backend/` directory:
```env
PORT=5005
NODE_ENV=development
DATABASE_URL="postgresql://postgres.bxrxmdshpvwtfistqggw:wMhMFM9wNaALAW3H@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.bxrxmdshpvwtfistqggw:wMhMFM9wNaALAW3H@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="autovault-secure-jwt-secret-string-2026"
JWT_EXPIRES_IN="7d"
```

### 3. Generate Prisma Client & Run
```bash
# Generate types
npx prisma generate --workspace=backend

# Start servers concurrently
npm run dev
```
* **Frontend Console**: `http://localhost:5180`
* **Backend API Docs**: `http://localhost:5005/api/docs`

---

## 🧪 Testing Coverage & CI/CD Pipeline

All integration tests compile and run successfully both locally and in the GitHub Actions virtual environment.

```bash
npm run test:backend
```

### 100% Green CI/CD Pipeline Status:
* **Backend Integration Test Suite (Jest & Supertest)**: **`PASS` (✅)**
* **Frontend Type Validation & Production Compilation**: **`PASS` (✅)**

```text
PASS tests/integration/health.test.ts
  GET /api/v1/health
    √ should return 200 and healthy status when DB is reachable (58 ms)
    √ should return 500 when database connection fails (9 ms)

PASS tests/integration/vehicle.test.ts
  Vehicle and Inventory Integration Tests
    GET /api/v1/vehicles
      √ should return 401 Unauthorized when request is unauthenticated (56 ms)
      √ should return paginated list of vehicles when authenticated (11 ms)
    POST /api/v1/vehicles
      √ should allow ADMIN to create a new vehicle (41 ms)
      √ should block USER role from creating a vehicle (10 ms)
    POST /api/v1/vehicles/:id/purchase
      √ should allow user to purchase vehicle (10 ms)
      √ should fail purchase if stock is empty (8 ms)

PASS tests/integration/auth.test.ts
  Auth Integration Tests
    POST /api/v1/auth/register
      √ should register a new user successfully (395 ms)
      √ should return 400 when email is already registered (12 ms)
    POST /api/v1/auth/login
      √ should log in existing user with correct credentials (11 ms)
      √ should return 401 on incorrect password (8 ms)

Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total
```

---

## 🤝 AI Pair-Programming Attribution

This project was built in a collaborative pair-programming session with **Gemini-Antigravity**, an agentic AI coding assistant designed by Google DeepMind.

* **Attribution**: Commits featuring AI cooperation are formatted with the git Co-authored trailer:
  `Co-authored-by: Gemini-Antigravity <antigravity@users.noreply.github.com>`
* **Division of Labor**:
  * **AI Assistant**: Handled initial schema definitions, mock service files compilation, and layout templates.
  * **Lead Developer**: Implemented validation middleware, updated database connection adapters for Prisma 7, verified tests convergence, and deployed the live instances on Render and Vercel.
