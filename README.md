# ShopSmart

[![Backend CI](https://github.com/sainath2212/shopsmart/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/sainath2212/shopsmart/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/sainath2212/shopsmart/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/sainath2212/shopsmart/actions/workflows/frontend-ci.yml)

A modern, full-stack e-commerce platform built with React and Express.js, featuring a comprehensive CI/CD pipeline, multi-tier testing strategy, and automated deployment to AWS EC2 .

---

## Overview

ShopSmart is a production-grade web application that demonstrates industry-standard development practices across the full software lifecycle: clean code, automated testing, continuous integration, security auditing, and deployment automation.

### Key Features

- **Product Catalog** -- Browse, search, filter by category, and sort products with a responsive grid layout.
- **Shopping Cart** -- Add items, adjust quantities, remove products, and view real-time subtotals via a slide-out cart drawer.
- **RESTful API** -- Fully documented endpoints for products, categories, and cart operations with auto-generated Swagger/OpenAPI specifications.
- **Multi-Tier Testing** -- Unit, integration, and end-to-end tests for both frontend and backend.
- **CI/CD Automation** -- GitHub Actions pipelines that lint, test, audit, build, and deploy on every push and pull request.
- **Dependency Management** -- Dependabot configured for automated weekly dependency updates.

---

## Technology Stack

| Layer        | Technologies                                                   |
|--------------|----------------------------------------------------------------|
| **Frontend** | React 18, Vite 5, Vitest, Testing Library, Playwright          |
| **Backend**  | Node.js, Express 4, Jest, Supertest, Swagger/OpenAPI           |
| **DevOps**   | GitHub Actions, Dependabot, ESLint, Prettier                   |
| **Deploy**   | AWS EC2 via SSH, PM2 process manager                           |

---

## Getting Started

Refer to [RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md) for complete setup, execution, and testing documentation.

### Quick Start

```bash
# Automated setup (idempotent)
bash scripts/setup.sh

# Start backend (Terminal 1)
cd server && npm run dev

# Start frontend (Terminal 2)
cd client && npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Documentation (Swagger)**: http://localhost:5001/api-docs

---

## Testing

### Backend (Jest + Supertest)

```bash
cd server
npm run test:unit         # 29 unit tests
npm run test:integration  # 16 integration tests
npm run test:e2e          # 12 end-to-end tests
npm run test:all          # Run all tiers
```

### Frontend (Vitest + Playwright)

```bash
cd client
npm run test:unit         # 9 unit tests
npm run test:integration  # 8 integration tests
npm run test:e2e          # 26 Playwright browser tests (Chromium + Firefox)
```

### Linting

```bash
cd server && npm run lint   # Backend ESLint
cd client && npm run lint   # Frontend ESLint
```

---

## CI/CD Pipeline

| Workflow         | Trigger                  | Stages                                                     |
|------------------|--------------------------|-------------------------------------------------------------|
| **Backend CI**   | Push/PR to `main`        | Lint, Unit Tests, Integration Tests, E2E, Swagger Validation, Security Audit, Build |
| **Frontend CI**  | Push/PR to `main`        | Lint, Unit Tests, Integration Tests, Security Audit, Build, Playwright E2E |
| **Deploy to EC2**| Push to `main` (manual)  | SSH, Git Pull, Install, Build, PM2 Restart, Health Check    |

Pull requests automatically trigger lint checks and test suites. Failing checks block the merge.

---

## Project Structure

```
shopsmart/
├── .github/
│   ├── workflows/
│   │   ├── backend-ci.yml         # Backend CI pipeline
│   │   ├── frontend-ci.yml        # Frontend CI pipeline
│   │   └── deploy-ec2.yml         # EC2 deployment workflow
│   └── dependabot.yml             # Dependency update configuration
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx                # Main application component
│   │   ├── index.css              # Design system and styles
│   │   └── __tests__/             # Unit and integration tests
│   └── e2e/                       # Playwright E2E tests
├── server/                        # Express backend
│   ├── src/
│   │   ├── app.js                 # Express application setup
│   │   └── routes/                # API route handlers
│   └── tests/                     # Unit, integration, and E2E tests
├── scripts/
│   ├── setup.sh                   # Idempotent local setup
│   ├── deploy.sh                  # Idempotent server deployment
│   └── health-check.sh            # Idempotent health verification
└── render.yaml                    # Render.com deployment config
```

---

## License

Copyright 2026 ShopSmart Project. All rights reserved.
