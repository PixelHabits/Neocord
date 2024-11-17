# syntax=docker/dockerfile:1

# Frontend build stage
FROM oven/bun:1 as frontend-builder
WORKDIR /app

# Copy root level package files for better caching
COPY package.json bun.lockb ./

# Copy frontend and shared package files
COPY frontend/package.json frontend/
COPY packages/ui/package.json packages/ui/
COPY packages/typescript-config/package.json packages/typescript-config/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY frontend/ frontend/
COPY packages/ packages/

# Build frontend
RUN bun run --cwd frontend build

# Backend stage
FROM ghcr.io/astral-sh/uv-py:3.13-slim

# Build arguments
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

# Create a non-privileged user
ARG UID=10001
RUN adduser \
  --disabled-password \
  --gecos "" \
  --home "/nonexistent" \
  --shell "/sbin/nologin" \
  --no-create-home \
  --uid "${UID}" \
  appuser

WORKDIR /app

# Non-sensitive build-time configuration
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
  postgresql-client \
  build-essential \
  python3-dev \
  libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency files first for better caching
COPY backend/pyproject.toml backend/uv.lock ./

# Install dependencies using uv with caching
RUN --mount=type=cache,target=/root/.cache/uv \
  uv sync --frozen-lockfile

# Copy backend source
COPY backend/ .

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Switch to non-root user
USER appuser

# Run migrations and start Flask
CMD uv run flask db upgrade && \
  uv run flask seed all && \
  uv run gunicorn app:app