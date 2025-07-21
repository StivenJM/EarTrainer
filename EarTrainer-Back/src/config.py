import os

NOTAS_DISPONIBLES = ["C", "D", "E", "F", "G", "A", "B"]

# Directorio donde se almacenan los modelos de usuario
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)
