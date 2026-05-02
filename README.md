# ShopSmart

[![CI/CD Pipeline](https://github.com/sainath2212/shopsmart/actions/workflows/deploy-pipeline.yml/badge.svg)](https://github.com/sainath2212/shopsmart/actions/workflows/deploy-pipeline.yml)
[![Backend CI](https://github.com/sainath2212/shopsmart/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/sainath2212/shopsmart/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/sainath2212/shopsmart/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/sainath2212/shopsmart/actions/workflows/frontend-ci.yml)
[![Docker Hub Build](https://github.com/sainath2212/shopsmart/actions/workflows/docker.yml/badge.svg)](https://github.com/sainath2212/shopsmart/actions/workflows/docker.yml)
[![EC2 Deploy](https://github.com/sainath2212/shopsmart/actions/workflows/deploy-ec2.yml/badge.svg)](https://github.com/sainath2212/shopsmart/actions/workflows/deploy-ec2.yml)

A modern, cloud-native e-commerce platform built with React and Express.js, featuring a robust multi-stage CI/CD pipeline, Infrastructure as Code (IaC), containerization, and automated dual-deployment to AWS ECS (Fargate) and AWS EKS (Kubernetes).

---

## Overview

ShopSmart is a production-grade web application demonstrating industry-standard development and DevOps practices across the full software lifecycle. It emphasizes highly-available cloud architecture, automated testing, container orchestration, and seamless continuous deployment.

### Key Features

- **Product Catalog** — Browse, search, filter by category, and sort products with a responsive grid layout.
- **Shopping Cart** — Add items, adjust quantities, remove products, and view real-time subtotals via a slide-out cart drawer.
- **RESTful API** — Fully documented endpoints for products, categories, and cart operations with auto-generated Swagger/OpenAPI specifications.
- **Multi-Tier Testing** — Unit, integration, and end-to-end tests for both frontend and backend.
- **Infrastructure as Code (IaC)** — Automated, idempotent provisioning of AWS infrastructure using Terraform.
- **Cloud-Native Deployment** — Multi-stage Docker builds seamlessly orchestrated across AWS Elastic Container Service (ECS Fargate) and Elastic Kubernetes Service (EKS).

---

## Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 18, Vite 5, Vitest, Testing Library, Playwright |
| **Backend** | Node.js, Express 4, Jest, Supertest, Swagger/OpenAPI |
| **Containerization** | Docker, Multi-stage Builds, Amazon ECR |
| **Orchestration** | Kubernetes (K8s), AWS ECS (Fargate), AWS EKS |
| **Infrastructure (IaC)** | Terraform, AWS VPC, ALB, NAT Gateways, S3 |
| **CI/CD & DevOps** | GitHub Actions, Dependabot, ESLint, Prettier |

---

## Architecture & Infrastructure

The application operates within a highly available, secure AWS environment completely managed via Terraform:

- **Network:** Custom VPC spanning multiple availability zones, utilizing Public Subnets (for ALB/NAT) and Private Subnets (for ECS/EKS compute instances).
- **Compute:** Dual-deployment strategy:
  - **Serverless Compute:** AWS ECS running on AWS Fargate.
  - **Managed Kubernetes:** AWS EKS cluster running managed node groups.
- **Traffic Routing:** Application Load Balancer (ALB) securely routes HTTP traffic to the appropriate backend or frontend target groups.
- **Artifacts & State:** Terraform state is managed locally via GitHub Actions cache, with Docker images securely stored in Amazon ECR.

---

## CI/CD Pipeline

The project utilizes a unified, multi-phase GitHub Actions workflow (`deploy-pipeline.yml`) that triggers on every push to the `main` branch:

| Phase | Description |
| --- | --- |
| **1. Test & Validate** | Parallel execution of frontend/backend linters, security audits, unit tests, integration tests, and Playwright E2E suites. |
| **2. Infrastructure Provisioning** | Executes `terraform apply` to provision or update the AWS VPC, ECR, ECS, EKS, and ALB resources. |
| **3. Container Build & Push** | Builds optimized multi-stage Docker images for the frontend and backend, tagging them via Git SHA, and pushing to Amazon ECR. |
| **4. Orchestration & Deployment** | Dynamically updates Kubernetes manifests and ECS service definitions, rolling out the new images with zero-downtime updates and automated health verification. |

---

## Getting Started

Refer to [RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md) for complete local setup, execution, and testing documentation.

### Quick Start (Local Development)

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

## Project Structure

```
shopsmart/
├── .github/
│   └── workflows/
│       ├── deploy-pipeline.yml    # Unified multi-stage CI/CD pipeline
│       └── docker.yml             # Docker Hub image builds
├── client/                        # React frontend
│   ├── Dockerfile                 # Multi-stage frontend container config
│   ├── src/                       # Application source
│   └── e2e/                       # Playwright E2E tests
├── server/                        # Express backend
│   ├── Dockerfile                 # Multi-stage backend container config
│   ├── src/                       # API handlers and logic
│   └── tests/                     # Unit, integration, and E2E tests
├── terraform/                     # Infrastructure as Code
│   ├── main.tf                    # AWS Provider & State Config
│   ├── vpc.tf                     # Network Topology
│   ├── ecr.tf                     # Container Registries
│   ├── ecs.tf                     # Fargate Cluster & ALB definitions
│   └── eks.tf                     # Kubernetes Cluster & Node Groups
└── k8s/                           # Kubernetes Manifests
    ├── namespace.yaml
    ├── backend-deployment.yaml
    └── frontend-deployment.yaml
```

---

## License

Copyright 2026 ShopSmart Project. All rights reserved.
