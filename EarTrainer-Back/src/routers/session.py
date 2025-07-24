from fastapi import APIRouter, HTTPException
from src.ml.predictor import UserModelManager
from src.schemas import IntentoInput, CrearSesionInput, CrearSesionResponse, CerrarSesionInput, CerrarSesionResponse
from src.db import crud
from datetime import datetime

router = APIRouter()
model_manager = UserModelManager()

@router.post("/crear", response_model=CrearSesionResponse)
async def crear_sesion(data: CrearSesionInput):
    """
    Crea una nueva sesión de entrenamiento para el usuario.
    """
    try:
        session_id = await crud.create_training_session(user_id=data.user_id, dificultad=data.dificultad)
        return CrearSesionResponse(session_id=session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/terminar", response_model=CerrarSesionResponse)
async def cerrar_sesion(data: CerrarSesionInput):
    """
    Marca la sesión de entrenamiento como finalizada (agrega finished_at).
    """
    try:
        # Asegura que finished_at sea un datetime sin zona horaria (naive)
        finished_at = datetime.now().replace(tzinfo=None)
        await crud.update_training_session(session_id=data.session_id, finished_at=finished_at)
        return {"success": True, "message": "Sesión cerrada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/registrar_intento")
async def registrar_intento(intento: IntentoInput):
    """
    Registra un intento del usuario en la base de datos.
    """
    try:
        await crud.log_note_attempt(
            session_id=intento.session_id,
            nota_correcta=intento.nota_correcta,
            notas_mostradas=intento.notas_mostradas,
            nota_elegida=intento.nota_elegida,
            tiempo_respuesta=intento.tiempo_respuesta,
            es_correcto=intento.es_correcto
        )
        return {"success": True, "message": "Intento registrado en la base de datos"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))