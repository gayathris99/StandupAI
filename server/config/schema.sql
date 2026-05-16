CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS standups (
    id SERIAL PRIMARY KEY,
    engineer_id INTEGER REFERENCES USERS(id),
    engineer_name VARCHAR(255) NOT NULL,
    raw_text TEXT NOT NULL,
    tasks_completed TEXT[],
    tasks_planned TEXT[],
    blockers JSONB,
    has_blockers BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()

);