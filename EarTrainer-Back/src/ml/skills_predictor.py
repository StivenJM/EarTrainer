import os
import pickle
import pandas as pd
import json

from src.db import crud
from src.config import SKILL_LEVEL_MODEL_PATH, SKILL_LEVEL_PARAMS_PATH

class SkillsPredictor:
    def __init__(self):
        """
        Initializes the SkillsPredictor by loading the pre-trained SVM model.
        """
        self.model = None
        self.normalization_params = None

        if not os.path.exists(SKILL_LEVEL_MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at: {SKILL_LEVEL_MODEL_PATH}")
        try:
            with open(SKILL_LEVEL_MODEL_PATH, 'rb') as f:
                self.model = pickle.load(f)
            print(f"Model loaded successfully from {SKILL_LEVEL_MODEL_PATH}")
        except Exception as e:
            raise IOError(f"Error loading model from {SKILL_LEVEL_MODEL_PATH}: {e}")
        
        # Cargar los parámetros de normalización
        if not os.path.exists(SKILL_LEVEL_PARAMS_PATH):
            raise FileNotFoundError(f"Normalization parameters file not found at: {SKILL_LEVEL_PARAMS_PATH}")
        try:
            with open(SKILL_LEVEL_PARAMS_PATH, 'r') as f:
                self.normalization_params = json.load(f)
            # Eliminar metadatos si existen, ya que no son parámetros de normalización
            if "__metadata__" in self.normalization_params:
                del self.normalization_params["__metadata__"]
            print(f"Normalization parameters loaded successfully from {SKILL_LEVEL_PARAMS_PATH}")
        except Exception as e:
            raise IOError(f"Error loading normalization parameters from {SKILL_LEVEL_PARAMS_PATH}: {e}")

        # Define the numerical features the model expects based on your notebook
        self.numerical_features = [
            'accuracy_easy',
            'accuracy_medium',
            'accuracy_hard',
            'avg_response_time',
            'games_played',
            'avg_session_duration'
        ]

    async def predict_skill_level(self, user_id: int) -> str:
        """
        Predicts the skill level of a player based on their performance data
        fetched from the database using the user_id.

        Args:
            user_id (int): The ID of the user whose skill level is to be predicted.

        Returns:
            str: The predicted skill level ('principiante', 'intermedio', or 'experto').

        Raises:
            ValueError: If no skill features are found for the given user_id.
            RuntimeError: If the model is not loaded.
        """
        if self.model is None:
            raise RuntimeError("Model is not loaded. Cannot make predictions.")

        # Obtener los datos del jugador desde la base de datos usando la funcion CRUD
        player_data = await crud.get_user_skill_features(user_id)

        if not player_data:
            raise ValueError(f"No skill features found for user ID: {user_id}. "
                             "Ensure the user has completed enough sessions according to the view criteria.")


        # Aplicar normalización Z-score a las características especificadas en el JSON
        normalized_player_data = player_data.copy()
        for feature, params in self.normalization_params.items():
            if feature in normalized_player_data:
                mean = params["mean"]
                std = params["std"]
                if std == 0: # Evitar división por cero
                    normalized_player_data[feature] = 0.0
                else:
                    normalized_player_data[feature] = (normalized_player_data[feature] - mean) / std
            else:
                print(f"Advertencia: La característica '{feature}' para normalización no se encontró en los datos del jugador.")

        # Create a DataFrame from the input data, ensuring correct column order
        try:
            input_df = pd.DataFrame([normalized_player_data], columns=self.numerical_features)
        except KeyError as e:
            # se mantiene por robustez.
            raise ValueError(f"Missing required feature in player_data fetched from DB: {e}. "
                             f"Expected features: {self.numerical_features}")

        # Make the prediction
        prediction = self.model.predict(input_df)

        return prediction[0]