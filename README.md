# Meeting Intelligence Service

## Project Overview
The **Meeting Intelligence Service** is a robust backend application designed to help users capture, manage, and analyze meetings. Leveraging the power of AI (via Groq SDK), the service automatically extracts key insights such as summaries, decisions, and action items from meeting transcripts. 

A core focus of this project is **Grounding and Accuracy**—every AI-generated insight is backed by citations (timestamps) from the original transcript to prevent hallucinations and ensure data integrity.

### Key Features
- **Meeting Management**: Create and store meetings with structured transcripts.
- **AI Analysis**: Automated generation of summaries, action items, and decisions using Groq's Mixtral model.
- **Action Item Tracking**: Full lifecycle management of tasks with status updates and overdue detection.
- **Automated Reminders**: A scheduled background job that identifies overdue tasks and sends notifications via Slack.
- **Enterprise Standards**: Implements unified API responses, request traceability (Trace IDs), and structured JSON logging.

---

## Architecture
The project follows a **layered, service-oriented architecture** to ensure separation of concerns, maintainability, and testability.

### 1. Route Layer
Defines the API endpoints and maps them to the appropriate controllers. It also handles request documentation via Swagger.

### 2. Controller Layer
Responsible for parsing incoming requests, validating inputs using **Zod**, and returning standardized responses. It acts as the bridge between the transport layer and the business logic.

### 3. Service Layer
The heart of the application. Contains all business logic, including:
- **AI Service**: Orchestrates LLM calls and ensures citation accuracy.
- **Auth Service**: Manages user registration, login, and JWT generation.
- **Scheduler Service**: Handles background cron jobs for task reminders.

### 4. Data Access Layer (Prisma & SQLite)
Uses **Prisma ORM** for type-safe database interactions with **SQLite**. This allows for easy schema migrations and the flexibility to switch to production databases like PostgreSQL with minimal config changes.

---

## Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (a template is provided below):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secure_random_string"
GROQ_API_KEY="your_groq_api_key"
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
PORT=3000
NODE_ENV=development
```

### 4. Database Initialization
Run the Prisma migrations to set up your local SQLite database:
```bash
npx prisma migrate dev --name init
```

### 5. Running the Application
- **Development Mode** (with hot-reload):
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

### 6. API Documentation
Once the server is running, you can explore and test the APIs through the interactive Swagger UI at:
**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---
