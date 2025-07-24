import os
import pickle
import numpy as np
from sklearn.linear_model import SGDClassifier
import random
from src.config import NOTAS_DISPONIBLES, MODELS_DIR
from src.schemas import SugerenciaResponse
from src.db import crud

class UserModelManager:
    def __init__(self):
        self.models = {}

    def _get_model_path(self, user_id):
        return os.path.join(MODELS_DIR, f"{user_id}.pkl")

    async def _load_model(self, user_id: int):
        """
        Carga el modelo desde la base de datos (usando crud.get_user_model) si existe,
        si no existe, deja el modelo en None.
        """
        user_model_info = await crud.get_user_model(user_id)
        if user_model_info and user_model_info["modelo_path"]:
            model_path = user_model_info["modelo_path"]
            if os.path.exists(model_path):
                with open(model_path, 'rb') as f:
                    self.models[user_id] = pickle.load(f)
                return
        self.models[user_id] = None

    async def _save_model(self, user_id, model):
        """
        Guarda el modelo en disco y actualiza la referencia en la base de datos.
        """
        model_path = self._get_model_path(user_id)
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
        # Calcular accuracy si se desea, aquí se pone None por simplicidad
        accuracy = None
        await crud.save_user_model(user_id=user_id, modelo_path=model_path, accuracy=accuracy)

    def _one_hot(self, nota):
        # Codifica una nota musical como one-hot vector de tamaño 7
        vec = np.zeros(len(NOTAS_DISPONIBLES))
        if nota in NOTAS_DISPONIBLES:
            idx = NOTAS_DISPONIBLES.index(nota)
            vec[idx] = 1
        return vec

    def _mostradas_one_hot(self, notas_mostradas: list[str]):
        vec = np.zeros(len(NOTAS_DISPONIBLES))
        for n in notas_mostradas:
            if n in NOTAS_DISPONIBLES:
                idx = NOTAS_DISPONIBLES.index(n)
                vec[idx] = 1
        return vec

    def _features(self, nota_correcta, notas_mostradas, nota_elegida, tiempo_respuesta, dificultad):
        # nota_correcta: str
        # notas_mostradas: list[str]
        # nota_elegida: str
        # tiempo_respuesta: float
        # dificultad: int

        # One-hot de la nota correcta
        correct_vec = self._one_hot(nota_correcta)
        # One-hot de la nota elegida
        elegida_vec = self._one_hot(nota_elegida)
        # One-hot de las notas mostradas (concatenadas)
        mostradas_vec = self._mostradas_one_hot(notas_mostradas)
        # Normaliza tiempo y dificultad
        tiempo = float(tiempo_respuesta)
        dificultad = float(dificultad)
        # Vector final: [correct_vec, elegida_vec, mostradas_vec, tiempo, dificultad]
        return np.concatenate([correct_vec, elegida_vec, mostradas_vec, [tiempo, dificultad]]).reshape(1, -1)

    async def train_user(self, user_id: int, session_id: int):
        """
        Entrena el modelo del usuario de manera incremental usando solo los intentos de la sesión indicada.
        """
        # Obtener solo los intentos de la sesión recién finalizada
        attempts = await crud.get_attempts_by_session(session_id)
        if not attempts:
            return  # No hay datos para entrenar

        X_list = []
        y_list = []
        for intento in attempts:
            nota_correcta = intento["nota_correcta"]
            notas_mostradas = intento["notas_mostradas"]
            nota_elegida = intento["nota_elegida"]
            tiempo_respuesta = intento["tiempo_respuesta"]
            dificultad = 1.0  # Puedes ajustar si tienes este dato en la tabla
            X = self._features(nota_correcta, notas_mostradas, nota_elegida, tiempo_respuesta, dificultad)
            X_list.append(X.flatten())  # Asegura que sea un vector 1D
            y_list.append(int(nota_correcta != nota_elegida))

        X_new = np.stack(X_list) if X_list else np.empty((0,))  # Corrige la conversión a ndarray
        y_new = np.array(y_list)

        # Cargar modelo existente o crear uno nuevo si no existe
        await self._load_model(user_id)
        model = self.models[user_id]
        if model is None:
            model = SGDClassifier(loss="log_loss", penalty="l2", max_iter=1000, random_state=42)
            model.partial_fit(X_new, y_new, classes=[0, 1])
        else:
            model.partial_fit(X_new, y_new)

        self.models[user_id] = model
        await self._save_model(user_id, model)

    async def sugerir_ejercicio(self, user_id: int, num_distractores=2):
        await self._load_model(user_id)
        model = self.models[user_id]
        last_attempts = await crud.get_last_n_note_attempts(user_id=user_id, n=3)
        last_notes = [attempt["nota_correcta"] for attempt in last_attempts] if last_attempts else []

        # Obtener última entrada para comparar distractores
        last_entry = last_attempts[0] if last_attempts else None
        last_mostradas = last_entry["notas_mostradas"] if last_entry else []
        last_distractores = [n for n in last_mostradas if n != last_entry["nota_correcta"]] if last_entry else []

        objetivo = np.random.choice([n for n in NOTAS_DISPONIBLES if n not in last_notes])

        # Si no hay modelo, sugiere aleatorio
        if model is None:
            distractores = list(np.random.choice([n for n in NOTAS_DISPONIBLES if n != objetivo], num_distractores, replace=False))
            return SugerenciaResponse(objetivo=objetivo, distractores=distractores)

        peor_prob = -1
        mejor_distractores = None

        posibles_distractores = [n for n in NOTAS_DISPONIBLES if n != objetivo]
        # Probar todas las combinaciones posibles de distractores
        from itertools import combinations
        for distractores_tuple in combinations(posibles_distractores, num_distractores):
            distractores = list(distractores_tuple)
            notas_mostradas = [objetivo] + distractores
            # Simular que el usuario elige la nota correcta (para contexto)
            X = self._features(objetivo, notas_mostradas, objetivo, 1.0, 1.0)
            prob_error = model.predict_proba(X)[0][1]  # probabilidad de equivocarse
            if prob_error > peor_prob:
                peor_prob = prob_error
                mejor_distractores = distractores

        if mejor_distractores:
            # Nueva regla: evitar repetir distractores anteriores exactamente
            if set(mejor_distractores) == set(last_distractores):
                mejor_distractores = random.sample(posibles_distractores, num_distractores)

            return SugerenciaResponse(objetivo=objetivo, distractores=mejor_distractores)
        else:
            distractores = list(np.random.choice([n for n in NOTAS_DISPONIBLES if n != objetivo], num_distractores, replace=False))
            return SugerenciaResponse(objetivo=objetivo, distractores=distractores)

