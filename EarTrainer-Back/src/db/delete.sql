-- Reinicia la numeración de las claves primarias al vaciar las tablas.
-- Es importante vaciar en el orden correcto debido a las dependencias de clave foránea.

-- 1. Eliminar filas y reiniciar secuencia de note_training_logs
TRUNCATE TABLE note_training_logs RESTART IDENTITY CASCADE;

-- 2. Eliminar filas y reiniciar secuencia de user_models
TRUNCATE TABLE user_models RESTART IDENTITY CASCADE;

-- 3. Eliminar filas y reiniciar secuencia de training_sessions
TRUNCATE TABLE training_sessions RESTART IDENTITY CASCADE;

-- 4. Eliminar filas y reiniciar secuencia de users
TRUNCATE TABLE users RESTART IDENTITY CASCADE;