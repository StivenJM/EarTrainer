-- Tabla existente, no necesita cambios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

---
-- Nueva tabla para registrar las sesiones de entrenamiento
CREATE TABLE IF NOT EXISTS training_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    dificultad TEXT NOT NULL,          -- Dificultad seleccionada para esta sesión ('easy', 'medium', 'hard')
    started_at TIMESTAMP DEFAULT NOW(), -- Momento en que la sesión comenzó
    finished_at TIMESTAMP              -- Momento en que la sesión terminó (puede ser NULL si no se completó)
);

---
-- Modificación de la tabla note_training_logs
CREATE TABLE IF NOT EXISTS note_training_logs (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES training_sessions(id), -- ¡Nueva columna para enlazar con la sesión!
    nota_correcta TEXT NOT NULL,
    notas_mostradas TEXT[] NOT NULL,
    nota_elegida TEXT NOT NULL,
    tiempo_respuesta REAL NOT NULL,
    es_correcto BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() -- Esto es el momento en que se registró la respuesta a la pregunta
);

-- Tabla user_models, no necesita cambios directos
CREATE TABLE IF NOT EXISTS user_models (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    modelo_path TEXT NOT NULL,
    last_trained_at TIMESTAMP,
    accuracy REAL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);