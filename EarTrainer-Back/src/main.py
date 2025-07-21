from fastapi import FastAPI
from src.routers import trainer, session, user
from src.db.database import database
from contextlib import asynccontextmanager

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

app.include_router(trainer.router, prefix="/api/trainer", tags=["trainer"])
app.include_router(session.router, prefix="/api/session", tags=["sessions"])
app.include_router(user.router, prefix="/api/user", tags=["user"])
