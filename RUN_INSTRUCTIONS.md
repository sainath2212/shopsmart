# Setup and Execution Instructions

This guide provides the necessary steps to configure, run, and test the ShopSmart project locally.

## 📋 Prerequisites

- **Node.js**: Version 18.x or 20.x
- **npm**: Version 9.x or higher

## 📂 Project Structure

- `/client`: React frontend application.
- `/server`: Express backend API.

---

## ⚡ Quick Start

### 1. Repository Setup
```bash
git clone https://github.com/sainath2212/shopsmart.git
cd shopsmart
```

### 2. Backend Initialization
```bash
cd server
npm install
npx prisma generate
# Optional: npx prisma migrate dev --name init
```

### 3. Frontend Initialization
```bash
cd ../client
npm install
npx playwright install --with-deps chromium firefox
```

---

## 🚀 Running the Application

### Backend Service
```bash
cd server
npm run dev # Runs with nodemon for hot-reloading
# API is available at: http://localhost:5001
# Swagger UI is available at: http://localhost:5001/api-docs
```

### Frontend Application
```bash
cd client
npm run dev
# Application is available at: http://localhost:5173
```

---

## 🧪 Testing Strategy

ShopSmart employs a comprehensive testing strategy to ensure reliability across all layers.

### Backend Tests (Jest)
```bash
cd server
npm run test:unit          # Handler-level tests with mock req/res
npm run test:integration   # API endpoint tests with Supertest
npm run test:e2e           # Scenario tests with a real TCP server
npm run test:all           # Execute all backend tests
npm run test:coverage      # Generate detailed coverage reports
```

### Frontend Tests (Vitest & Playwright)
```bash
cd client
npm run test:unit          # Component-level tests (mocked fetch)
npm run test:integration   # Async flow and state transition tests
npm run build              # Required before running E2E
npm run test:e2e           # Full browser automation (Chromium/Firefox)
```

---

## 🛠️ DevOps and Tooling

### Swagger/OpenAPI Generation
To manually generate the API specification without running the server:
```bash
cd server
npm run swagger-gen
```

### CI/CD Simulation
The project uses GitHub Actions. You can view the workflow definitions in `.github/workflows/`. Key jobs include:
- **Lint Check**: `npm run lint`
- **Security Check**: `npm audit --audit-level=high`
- **Smoke Testing**: Automatic server start and health check validation.
