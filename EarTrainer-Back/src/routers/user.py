from fastapi import APIRouter, HTTPException
from src.schemas import CrearUsuarioInput, CrearUsuarioResponse
from src.db import crud

router = APIRouter()

@router.post("/crear_usuario", response_model=CrearUsuarioResponse)
async def crear_usuario(data: CrearUsuarioInput):
    """
    Crea un usuario si no existe y retorna su id y username.
    """
    try:
        user = await crud.get_or_create_user(data.username)
        return CrearUsuarioResponse(user_id=user["id"], username=user["username"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
