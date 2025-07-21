from fastapi import APIRouter, HTTPException, Body
from src.ml.predictor import UserModelManager
from src.schemas import SugerenciaResponse, SugerenciaRequest

router = APIRouter()
model_manager = UserModelManager()

@router.post("/sugerir_ejercicio", response_model=SugerenciaResponse)
async def sugerir_ejercicio(req: SugerenciaRequest):
    """
    Sugiere una nota objetivo y los distractores para el usuario.
    """
    try:
        sugerencia = await model_manager.sugerir_ejercicio(req.user_id, req.num_distractores)
        return sugerencia
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/entrenar_modelo")
async def entrenar_modelo(user_id: int = Body(...), session_id: int = Body(...)):
    """
    Entrena el modelo del usuario de manera incremental usando los intentos de la sesión indicada.
    """
    try:
        await model_manager.train_user(user_id=user_id, session_id=session_id)
        return {"success": True, "message": "Modelo entrenado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
