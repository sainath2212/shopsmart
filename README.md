# ShopSmart

[![Backend CI](https://github.com/sainath2212/shopsmart/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/sainath2212/shopsmart/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/sainath2212/shopsmart/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/sainath2212/shopsmart/actions/workflows/frontend-ci.yml)

A modern, robust e-commerce platform designed for speed, security, and scalability. This project features a React-based frontend and an Express-powered backend, all integrated with a comprehensive CI/CD pipeline for maximum reliability.

## 🚀 Overview

ShopSmart is a full-stack application that leverages industry-standard tools and practices to deliver a high-quality development experience and a seamless end-user product.

### Core Features

- **Blazing Fast Frontend**: Built with React and Vite for near-instant rendering and updates.
- **Scalable REST API**: A performant Express.js backend with automated Swagger/OpenAPI documentation.
- **Total Test Coverage**: Multi-layered testing strategy including Unit, Integration, and E2E (Playwright) tests.
- **Enterprise CI/CD**: Fully automated pipelines using GitHub Actions for linting, security audits, testing, and artifacts generation.
- **Type-Safe Data Access**: Prisma integration for a robust and maintainable database layer (SQLite ready).

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Vitest, Testing Library, Playwright, Vanilla CSS |
| **Backend** | Node.js, Express, Jest, Supertest, Prisma, Swagger/OpenAPI |
| **DevOps** | GitHub Actions, npm audit, ESLint, Smoke Testing |

## 📖 Documentation

Detailed instructions for setup and execution are available in the [RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md) file.

- **[Runner Instructions](RUN_INSTRUCTIONS.md)**: How to get the project up and running locally.
- **[API Documentation](http://localhost:5001/api-docs)**: Interactive Swagger UI (Requires backend to be running).
- **[Test Execution Guide](RUN_INSTRUCTIONS.md#🧪-testing-strategy)**: How to run and interpret test results.

## 📈 Quality Assurance

Every pull request and push to the main branch undergoes a rigorous CI process:
- **Linting**: Ensures code style consistency.
- **Security Audit**: Automated vulnerability scanning using `npm audit`.
- **Three-Tier Testing**: Ensures correctness from individual handlers to full browser integration.
- **Swagger Validation**: Guarantees the API specification matches the implementation.

---
© 2026 ShopSmart Project. All rights reserved.
