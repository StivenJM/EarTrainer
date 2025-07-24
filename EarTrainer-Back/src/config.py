import os

NOTAS_DISPONIBLES = ["C", "D", "E", "F", "G", "A", "B"]

# Directorio donde se almacenan los modelos de usuario
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# Directorio donde se almacenan los modelos preentrenados generales
GENERAL_MODELS_DIR = os.path.join(BASE_DIR, "general_models")
os.makedirs(GENERAL_MODELS_DIR, exist_ok=True)

SKILL_LEVEL_MODEL_PATH = os.path.join(GENERAL_MODELS_DIR, "skill_level_model.pkl")
SKILL_LEVEL_PARAMS_PATH = os.path.join(GENERAL_MODELS_DIR, "skill_level_model.json")
