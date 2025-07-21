import os
from databases import Database
from dotenv import load_dotenv

load_dotenv()  # Cargar variables de .env

DATABASE_URL = os.getenv("DATABASE_URL")

# Instancia global de la conexión a la base de datos
database = Database(DATABASE_URL)
