# src/db/crud.py

from src.db.database import database

# Crear nueva sesión de entrenamiento
async def create_training_session(user_id: int, dificultad: str) -> int:
    query = """
    INSERT INTO training_sessions (user_id, dificultad)
    VALUES (:user_id, :dificultad)
    RETURNING id
    """
    values = {"user_id": user_id, "dificultad": dificultad}
    session_id = await database.execute(query=query, values=values)
    return session_id

# Actualizar estadísticas al finalizar la sesión
async def update_training_session(session_id: int, finished_at):
    # finished_at debe ser un objeto datetime.datetime, no string
    query = """
    UPDATE training_sessions
    SET finished_at = :finished_at
    WHERE id = :session_id
    """
    values = {
        "finished_at": finished_at,
        "session_id": session_id,
    }
    await database.execute(query=query, values=values)

# Obtener sesiones de un usuario
async def get_user_sessions(user_id: int):
    query = """
    SELECT * FROM training_sessions
    WHERE user_id = :user_id
    ORDER BY started_at DESC
    """
    return await database.fetch_all(query=query, values={"user_id": user_id})


# ----------------------------------------------------------------------
# ----------------------------------------------------------------------

# Registrar intento de nota
async def log_note_attempt(session_id: int, nota_correcta: str, notas_mostradas: list[str],
                           nota_elegida: str, tiempo_respuesta: float, es_correcto: bool):
    query = """
    INSERT INTO note_training_logs (
        session_id, nota_correcta, notas_mostradas, nota_elegida,
        tiempo_respuesta, es_correcto
    )
    VALUES (
        :session_id, :nota_correcta, :notas_mostradas, :nota_elegida,
        :tiempo_respuesta, :es_correcto
    )
    """
    values = {
        "session_id": session_id,
        "nota_correcta": nota_correcta,
        "notas_mostradas": notas_mostradas,
        "nota_elegida": nota_elegida,
        "tiempo_respuesta": tiempo_respuesta,
        "es_correcto": es_correcto,
    }
    await database.execute(query=query, values=values)

# Obtener todos los intentos de una sesión
async def get_attempts_by_session(session_id: int):
    query = "SELECT * FROM note_training_logs WHERE session_id = :session_id"
    return await database.fetch_all(query=query, values={"session_id": session_id})



# ----------------------------------------------------------------------
# ----------------------------------------------------------------------


# Guardar o actualizar modelo entrenado por usuario
async def save_user_model(user_id: int, modelo_path: str, accuracy: float):
    query = """
    INSERT INTO user_models (user_id, modelo_path, last_trained_at, accuracy)
    VALUES (:user_id, :modelo_path, NOW(), :accuracy)
    ON CONFLICT (user_id) DO UPDATE
    SET modelo_path = EXCLUDED.modelo_path,
        last_trained_at = NOW(),
        accuracy = EXCLUDED.accuracy
    """
    await database.execute(query, {
        "user_id": user_id,
        "modelo_path": modelo_path,
        "accuracy": accuracy,
    })

# Obtener info del modelo del usuario
async def get_user_model(user_id: int):
    query = "SELECT * FROM user_models WHERE user_id = :user_id"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# Crear usuario si no existe y retornar su id
async def get_or_create_user(username: str) -> dict:
    # Intenta obtener el usuario
    query_get = "SELECT id, username FROM users WHERE username = :username"
    user = await database.fetch_one(query=query_get, values={"username": username})
    if user:
        return dict(user)
    # Si no existe, créalo
    query_create = "INSERT INTO users (username) VALUES (:username) RETURNING id, username"
    user = await database.fetch_one(query=query_create, values={"username": username})
    return dict(user)


