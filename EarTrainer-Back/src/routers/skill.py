from fastapi import APIRouter, HTTPException
from contextlib import asynccontextmanager
from src.ml.skills_predictor import SkillsPredictor

skills_predictor_instance: SkillsPredictor = None

@asynccontextmanager
async def lifespan_skill_router(app: APIRouter):
    global skills_predictor_instance
    try:
        skills_predictor_instance = SkillsPredictor()
        print("SkillsPredictor inicializado y modelo cargado exitosamente para el router de habilidad.")
    except (FileNotFoundError, IOError) as e:
        print(f"Error al cargar el modelo de habilidad para el router: {e}")
        raise RuntimeError(f"No se pudo cargar el modelo de habilidad para el router: {e}")
    yield
    print("Router de habilidad finalizando. Limpieza de recursos...")

router = APIRouter(lifespan=lifespan_skill_router)

@router.post("/predict-skill-level/{user_id}", response_model=str, summary="Predice el nivel de habilidad de un jugador")
async def predict_player_skill(user_id: int):
    if skills_predictor_instance is None:
        raise HTTPException(status_code=503, detail="El modelo de predicción de habilidad no está cargado. La aplicación no se inició correctamente.")

    try:
        predicted_skill = await skills_predictor_instance.predict_skill_level(user_id)
        return predicted_skill
    except ValueError as e:
        raise HTTPException(status_code=404, detail=f"No se encontraron datos de habilidad para el usuario con ID: {user_id}. {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor al predecir la habilidad: {e}")

@router.get("/health", summary="Verifica el estado del router de habilidad")
async def health_check_skill_router():
    if skills_predictor_instance is None:
        return {"status": "unhealthy", "model_loaded": False, "message": "SkillsPredictor no inicializado en el router de habilidad."}
    return {"status": "healthy", "model_loaded": True, "message": "Router de habilidad y modelo cargados."}
