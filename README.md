# TaskFlow - Level 2 (Full-Stack)

TaskFlow is a modern, full-stack task management application with secure authentication and role-based access control.

## Tech Stack
- **Frontend**: React (Functional Components, Hooks, Context API)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Auth**: JWT + bcryptjs
- **Validation**: Zod
- **Styling**: Vanilla CSS (Modern design)

## Prerequisites
- Node.js (v18+)
- Docker (for PostgreSQL)

## Setup Instructions

### 1. Database Setup
Start the PostgreSQL container:
```bash
docker-compose up -d
```
The password is set to `root` in `docker-compose.yml`.

Initialize the schema:
```bash
# In the project root (c:\Users\yahya\Downloads\taskflow-react-app)
psql -h localhost -U postgres -d taskflow -f sql/schema.sql
```

### 2. Environment Variables
Create a `.env` file from the example:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application
I've simplified this! You can now start both the frontend and backend with a single command:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Architecture
This project follows a clean architecture:
- `routes/`: API endpoint definitions
- `controllers/`: Request handling and validation
- `services/`: Business logic
- `repositories/`: Database abstraction
- `middleware/`: Auth, role protection, and error handling
- `context/`: Frontend global state (Auth)
