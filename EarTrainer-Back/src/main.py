from fastapi import FastAPI
from src.routers import trainer, session, user, skill
from src.db.database import database
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
load_dotenv()

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
origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = origins_env.split(",") if origins_env else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trainer.router, prefix="/api/trainer", tags=["trainer"])
app.include_router(skill.router, prefix="/api/skill", tags=["skill"])
app.include_router(session.router, prefix="/api/session", tags=["sessions"])
app.include_router(user.router, prefix="/api/user", tags=["user"])

if __name__ == "__main__":
    import uvicorn
    import os

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)