import pandas as pd
from sklearn.model_selection import StratifiedKFold
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix
import numpy as np
import mlflow
import mlflow.sklearn

# Códigos ANSI para colores de texto
COLOR_VERDE = "\033[92m"
COLOR_FIN = "\033[0m"

print("\n\nCarga de datos...")
# Cargar los datos
# ----------------
df = pd.read_csv('musical_skills_smote_final.csv')

numerical_features = ['accuracy_easy', 'accuracy_medium', 'accuracy_hard', 'avg_response_time', 'games_played', 'avg_session_duration']
X = df[numerical_features]
y = df['skill_level']


# Configuraciones de MLFlow
# -------------------------
mlflow.set_experiment("Modelo SVM de Producción Habilidad Musical")

print("\nEntrenamiento del modelo...")
with mlflow.start_run(run_name="Final_SVM_Model_Training"):
    svm = SVC(random_state=42)
    svm.fit(X, y)

    # Número de vectores de soporte por clase
    print("\n\nResultados\n--------------------------\n")
    print("VECTORES DE SOPORTE")
    for clase, num_vecs in zip(svm.classes_, svm.n_support_):
        print(f"Clase {clase}: {num_vecs} vectores de soporte")
        mlflow.log_param(f"num_support_vectors_{clase}", num_vecs)

    print("\n--------------------------\n")

    # Registrar el modelo final utilizando MLflow
    # Esto guardará el modelo en un formato estándar de MLflow y registrará sus detalles
    mlflow.sklearn.log_model(
        sk_model=svm,
        name="svm_musical_skills_model",
        registered_model_name="SVM Musical Skills Classifier v1.0", # Nombre bajo el cual se registrará en el Model Registry
        input_example=X.head(1)
    )

    print(f"Modelo registrado en: {mlflow.active_run().info.artifact_uri}/svm_musical_skills_model")
    print(f"\n{COLOR_VERDE}Para ver el modelo en el Model Registry, ejecuta 'mlflow ui' y navega a la pestaña 'Models'.{COLOR_FIN}")


print("\n" + "="*50)
print("FIN DEL PROCESO")
print("="*50 + "\n")
