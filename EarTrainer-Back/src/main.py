from fastapi import FastAPI
from src.routers import trainer, session, user, skill
from src.db.database import database
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(
    title="EarTrainer API",
    description="API para entrenamiento auditivo musical para niños",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS middleware
origins = [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://192.168.1.*",  # Para acceso desde dispositivos móviles
    "http://0.0.0.0:5173",
    "http://192.168.100.102:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporal para pruebas - cambia por 'origins' en producción
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trainer.router, prefix="/api/trainer", tags=["trainer"])
app.include_router(skill.router, prefix="/api/skill", tags=["skill"])
app.include_router(session.router, prefix="/api/session", tags=["sessions"])
app.include_router(user.router, prefix="/api/user", tags=["user"])
