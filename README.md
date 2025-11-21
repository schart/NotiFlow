# Notification Service

A microservice-style notification system built with **GraphQL**, **RabbitMQ**, **Prisma**, and **Docker**.
This project was created to practice **GraphQL** and **RabbitMQ**, while maintaining a **PostgreSQL database** and microservice architecture.

“This fully functional notification service was designed and implemented in just 4 days, demonstrating rapid prototyping and full-stack skills with GraphQL, RabbitMQ, Prisma, and Docker.”

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Design](#design)
- [Setup & Run](#setup--run)
- [Environment Variables](#environment-variables)
- [Notes](#notes)

---

## Features

- GraphQL API for notification jobs
- RabbitMQ queues for **email** and **SMS**
- Worker services with idempotency check
- PostgreSQL persistence with Prisma ORM
- Dockerized for easy setup

---

## Tech Stack

- Node.js & TypeScript
- GraphQL
- Prisma ORM
- RabbitMQ
- PostgreSQL
- Docker & Docker Compose

---

## Design

Here the diagram of the system:

> ![Notification Flow Diagram](docs/Notification%20Engine%20Design.png)
> (actual diagram image)

---

## Setup & Run

1. **Clone the repository**

```bash
git clone <repo-url>
cd <repo-folder>
```

2. **Copy environment variables**

```bash
cp .env.example .env
```

3. **Start Docker services**

```bash
docker-compose up --build
```

4. **Run migrations**

```bash
docker-compose exec app npx prisma migrate dev
```

5. **Start the app**

```bash
docker-compose exec app npm run start:dev
```

6. **Start the worker**

```bash
docker-compose exec worker sh /app/entrypoint.sh npm run start:worker:dev
```

---

## Environment Variables

```env
# ============================
# DATABASE
# ============================
DATABASE_URL=postgresql://postgres:root@postgres:5432/notification_engine?schema=public

# ============================
# RABBITMQ
# ============================
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# ============================
# SMTP / MAIL
# ============================
SENDER_EMAIL=?
SMTP_HOST=?
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=?
SMTP_PASS=?
```

---

## Notes

- This project is built to practice **GraphQL + RabbitMQ + Prisma**
- System design favors **modularity** and **microservice style**
- Future plan: pivot to a larger scale system

---
