# EarTrainer-Back: The Core API

This directory contains the backend of the EarTrainer application, built with FastAPI. It serves as the central system, providing all necessary endpoints for user management, game session handling, machine learning model integration, and communication with a PostgreSQL database.

## Table of Contents

- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Database Interaction](#database-interaction)
- [Machine Learning Integration](#machine-learning-integration)

## Project Structure

```
EarTrainer-Back/
├── README.md
├── models/
│   └── 1.pkl
├── requirements.txt
└── src/
    ├── __init__.py
    ├── config.py
    ├── db/
    │   ├── crud.py
    │   ├── database.py
    │   ├── init_db.py
    │   └── schema.sql
    ├── main.py
    ├── ml/
    │   ├── model_store.py
    │   └── predictor.py
    ├── routers/
    │   ├── session.py
    │   ├── trainer.py
    │   └── user.py
    └── schemas.py
```

## Key Features

- **User Management**: Endpoints for user creation, authentication, and profile management.
- **Game Session Handling**: Full lifecycle control of game sessions, including creation, tracking, and scoring.
- **Database Integration**: Seamless communication with PostgreSQL for storing user data, sessions, and scores.
- **Machine Learning API**: Dedicated routes to interact with trained models for personalized recommendations and adaptive difficulty.

## Technologies Used

- FastAPI
- PostgreSQL
- SQLAlchemy
- Uvicorn

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.8 or higher
- pip
- PostgreSQL (or Docker as an alternative)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd EarTrainer/EarTrainer-Back
```

2. Create a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running the Application

1. Configure the database connection in a `.env` file or directly in `config.py`.

2. Initialize the database schema:

```bash
python -m src.db.init_db
```

3. Start the server:

```bash
uvicorn src.main:app --reload
```

The API documentation will be available at:  
http://127.0.0.1:8000/docs

## Database Interaction

The `src/db` module contains all database-related logic:

- `database.py`: Manages connection and session with PostgreSQL.
- `schema.sql`: Defines table structures.
- `crud.py`: Implements CRUD operations for database models.
- `init_db.py`: Initializes the schema.

## Machine Learning Integration

The `src/ml` directory handles integration of pre-trained ML models:

- `model_store.py`: Loads and manages serialized models (e.g., `1.pkl`).
- `predictor.py`: Contains prediction logic, exposed through the API.

This enables intelligent features such as performance-based recommendations and dynamic difficulty adjustment.
