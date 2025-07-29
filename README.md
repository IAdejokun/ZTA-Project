# ZTA Project

## Overview

This repository contains three main components:

- **Backend**: FastAPI application located under `backend/`. It exposes REST APIs for managing devices and metrics, and connects to a PostgreSQL database.
- **Frontend**: React application in `frontend/zta-frontend/` built with Vite and TypeScript.
- **Simulator**: Legacy IoT simulator in `simulator/legacy_iot_simulator.py` that generates device traffic for testing the backend.

## Installation

### Python dependencies

```bash
pip install -r requirements.txt
```

### Node dependencies

Install frontend dependencies from inside the frontend directory:

```bash
cd frontend/zta-frontend
npm install
```

## Environment variables

Create a `.env` file in `backend/` with variables for PostgreSQL connectivity:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zta_db
```

## Running the applications

### Start the FastAPI backend

From the repository root:

```bash
uvicorn app.main:app --reload --app-dir backend
```

### Start the React frontend

```bash
cd frontend/zta-frontend
npm run dev
```

### Run the simulator

```bash
python simulator/legacy_iot_simulator.py
```

