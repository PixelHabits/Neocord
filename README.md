# Neocord - Modern Real-Time Communication Platform

A modern real-time communication platform built with a focus on performance, developer experience, and scalability. This project was developed as part of App Academy's software engineering bootcamp.

## 🚀 Technology Stack

### Backend
[![Python](https://img.shields.io/badge/Python-3.13+-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-black?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![UV](https://img.shields.io/badge/UV-latest-blueviolet?logo=python&logoColor=white)](https://github.com/astral-sh/uv)
[![Ruff](https://img.shields.io/badge/Ruff-0.7.3-red?logo=python&logoColor=white)](https://github.com/astral-sh/ruff)

- **Python 3.13+**: Modern Python with strict typing
- **Flask**: Lightweight WSGI web application framework
- **UV**: Ultra-fast Python package manager and resolver
- **SQLAlchemy**: SQL toolkit and ORM
- **Alembic**: Lightweight database migration tool
- **SQLite**: Fast local development database
- **PostgreSQL**: Production-grade database (deployed via Terraform)
- **Ruff**: Extremely fast Python linter and formatter
- **Custom Authentication**: Self-implemented secure authentication solution

### Frontend
[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-latest-brown?logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)

- **React 18**: Modern UI development
- **TypeScript**: Type-safe JavaScript
- **Zustand**: Lightweight state management
- **Tailwind v4**: Utility-first CSS framework
- **SWC**: Super-fast JavaScript/TypeScript compiler

### DevOps & Tooling
[![Bun](https://img.shields.io/badge/Bun-1.0+-black?logo=bun&logoColor=white)](https://bun.sh/)
[![Turborepo](https://img.shields.io/badge/Turborepo-latest-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)
[![Docker](https://img.shields.io/badge/Docker-latest-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Terraform](https://img.shields.io/badge/Terraform-latest-7B42BC?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Biome](https://img.shields.io/badge/Biome-1.9-green?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Renovate](https://img.shields.io/badge/Renovate-latest-blue?logo=renovatebot&logoColor=white)](https://docs.renovatebot.com/)

- **Turborepo**: High-performance build system for JavaScript/TypeScript monorepos
- **Bun**: Fast all-in-one JavaScript runtime & package manager
- **UV**: Modern Python package management (triggered via Bun)
- **Biome**: Fast formatter and linter for JavaScript/TypeScript
- **Terraform**: Infrastructure as Code for cloud deployment
- **Docker**: Containerization for consistent deployments
- **Renovate**: Automated dependency updates and security vulnerability management
- **Git Hooks**: Pre-commit and pre-push workflows for code quality
- **Testing**: Comprehensive test suites for both frontend and backend

## 🏗️ Project Structure

```
neocord/
│── frontend/     # React application
│── backend/      # Flask API
│── packages/
│   ├── ui/          # Shared UI components
│   └── config/      # Shared configurations
│── terraform/       # Infrastructure as Code
└── docker/          # Docker configurations
```

## 💻 Development Workflow

Our monorepo is optimized for team development with:

1. **Unified Package Management**:
   - Bun for JavaScript/TypeScript dependencies
   - UV for Python dependencies (automatically triggered through Bun)
   - Single `bun install` command handles entire monorepo setup
2. **Turborepo Pipeline**: Optimized build and development workflows
3. **Shared Configurations**: Consistent tooling across packages
4. **Type Safety**: End-to-end TypeScript integration
5. **Database Management**:
   - SQLite for rapid local development
   - Alembic migrations for version control
   - PostgreSQL for production (automated via Terraform)
6. **Code Quality**:
   - Biome for JavaScript/TypeScript
   - Ruff for Python
   - Pre-commit hooks
   - Automated testing
7. **Dependency Management**:
   - Renovate for automated updates
   - Security vulnerability scanning
   - Scheduled dependency maintenance

### Getting Started

```sh
# Install all dependencies (JavaScript, TypeScript, and Python)
bun install

# Start development servers
bun dev

# Build all packages
bun build

# Run tests
bun test

# Setup database (automatically use UV)
bun run --cwd backend db:setup
```

### Backend Development

```sh
cd apps/backend
bun run dev
```

### Frontend Development

```sh
cd apps/frontend
bun run dev
```

## 🌟 Features

- Real-time messaging
- Server creation and management
- Channel organization
- User authentication and authorization
- Message reactions and threading
- Modern, responsive UI
- State management with Zustand
- Database migrations with Alembic

## 🛠️ Backend API Routes

```
/api/auth
  POST /login         # User login
  POST /signup        # User registration
  GET /               # Authentication check
  GET /logout         # User logout
  GET /csrf           # Get CSRF token

/api/users
  GET /              # Get all users
  GET /<id>          # Get specific user

/api/servers
  GET /              # Get all servers
  POST /             # Create new server
  PUT /<id>          # Update server
  DELETE /<id>       # Delete server

/api/channels
  GET /<id>          # Get channel
  POST /             # Create channel
  PUT /<id>          # Update channel
  DELETE /<id>       # Delete channel

/api/messages
  GET /<id>          # Get message
  POST /             # Create message
  PUT /<id>          # Update message
  DELETE /<id>       # Delete message

/api/reactions
  GET /<id>          # Get reaction
  POST /             # Create reaction
  DELETE /<id>       # Delete reaction
```


## 📦 Dependencies

### Backend
- Flask and Extensions (CORS, Login, Migrate, SQLAlchemy, WTF)
- SQLAlchemy and Alembic for database management
- Gunicorn for production server
- Python-dotenv for environment management
- WTForms for form validation

### Frontend
- React 18 with TypeScript
- Zustand for state management
- TailwindCSS for styling
- SWC for compilation
- Socket.io for real-time communication


## 🚀 Deployment

The application is deployed using Terraform for infrastructure management and Docker for containerization. Deployment configurations can be found in the `/terraform` and `/docker` directories.

### Production Setup

1. Configure environment variables
2. Run Terraform scripts to provision PostgreSQL and other infrastructure
3. Build and push Docker containers
4. Deploy using CI/CD pipeline

### Database Management

- **Development**: SQLite for fast local development
- **Production**: PostgreSQL provisioned via Terraform
- **Migrations**: Managed through Alembic
- **Data Persistence**: Handled by Docker volumes in production

## 👥 Team

<a href="https://github.com/your-username/neocord/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=PixelHabits/neocord" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## 🙏 Acknowledgments

- App Academy for project guidance
- Open source community for various tools and libraries
