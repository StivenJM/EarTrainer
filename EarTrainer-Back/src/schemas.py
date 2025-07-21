from pydantic import BaseModel
from typing import List

class SugerenciaRequest(BaseModel):
    user_id: int
    num_distractores: int = 2

class SugerenciaResponse(BaseModel):
    objetivo: str
    distractores: List[str]

class IntentoInput(BaseModel):
    session_id: int
    nota_correcta: str
    notas_mostradas: List[str]
    nota_elegida: str
    tiempo_respuesta: float
    es_correcto: bool

class CrearSesionInput(BaseModel):
    user_id: int
    dificultad: str

class CrearSesionResponse(BaseModel):
    session_id: int

class CrearUsuarioInput(BaseModel):
    username: str

class CrearUsuarioResponse(BaseModel):
    user_id: int
    username: str
