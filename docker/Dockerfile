# syntax=docker/dockerfile:1

# Frontend build stage
FROM oven/bun:1 as frontend-builder
WORKDIR /neocord

# Copy root level package files for better caching
COPY package.json bun.lockb ./

# Copy all package.json files to ensure workspace resolution
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY packages/ui/package.json packages/ui/
COPY packages/typescript-config/package.json packages/typescript-config/

# Install dependencies (skip backend scripts)
RUN bun install --frozen-lockfile --ignore-scripts

# Copy source code
COPY frontend/ frontend/
COPY packages/ packages/

# Build frontend
RUN bun run --cwd frontend build

# Backend stage
FROM ghcr.io/astral-sh/uv:python3.9-alpine

# Build arguments
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

# Debug: Print build arguments
RUN echo "FLASK_APP: ${FLASK_APP}" && \
    echo "FLASK_ENV: ${FLASK_ENV}" && \
    echo "DATABASE_URL: ${DATABASE_URL}" && \
    echo "SCHEMA: ${SCHEMA}"

WORKDIR /neocord

# Non-sensitive build-time configuration
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=${FLASK_APP}
ENV FLASK_ENV=${FLASK_ENV}

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    gcc \
    python3-dev \
    musl-dev \
    postgresql-client

# Copy dependency files for backend
COPY backend/pyproject.toml backend/uv.lock backend/

# Install dependencies using uv with caching
RUN --mount=type=cache,target=/root/.cache/uv \
    cd backend && uv sync --frozen

# Copy all source code maintaining directory structure
COPY backend/ backend/
COPY packages/ packages/

# Copy built frontend from builder stage
COPY --from=frontend-builder /neocord/frontend/dist frontend/dist

# Run migrations and start Flask from backend directory
CMD cd backend && \
    uv run flask db upgrade && \
    uv run flask seed all && \
    uv run gunicorn app:app