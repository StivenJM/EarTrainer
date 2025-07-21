import pandas as pd
from sklearn.model_selection import StratifiedKFold
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix
import numpy as np
import mlflow
import mlflow.sklearn


print("\n\nLoading dataset\n--------------------------\n")
# Cargar los datos
# ----------------
df = pd.read_csv('musical_skills_smote_final.csv')

numerical_features = ['accuracy_easy', 'accuracy_medium', 'accuracy_hard', 'avg_response_time', 'games_played', 'avg_session_duration']
X = df[numerical_features]
y = df['skill_level']


# Configuraciones de MLFlow
# -------------------------
mlflow.set_experiment("Clasificación Nivel Habilidad Musical SVM")
mlflow.sklearn.autolog()

# Entrenamiento del modelo SVM
# ----------------------------
n_splits = 5
skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)

conf_matrices = []
fold_accuracy = []
fold_precision = []
fold_recall = []

class_labels = sorted(y.unique(), reverse=True)


print("\n\nTraining SVM model\n--------------------------\n")
# Start execution of the MLflow run
# ---------------------------------
with mlflow.start_run(run_name="SVM_CrossValidation_Experiment - poly kernel"):
    mlflow.log_param("n_splits_cv", n_splits)
    mlflow.log_param("stratified_kfold_random_state", 42)

    for fold, (train_index, val_index) in enumerate(skf.split(X, y)):
        print(f"Processing Fold {fold + 1}/{n_splits}")

        X_train_fold, X_val_fold = X.iloc[train_index], X.iloc[val_index]
        y_train_fold, y_val_fold = y.iloc[train_index], y.iloc[val_index]

        svm_model_fold = SVC(kernel='poly', random_state=42)
        svm_model_fold.fit(X_train_fold, y_train_fold)

        y_val_pred = svm_model_fold.predict(X_val_fold)

        cm = confusion_matrix(y_val_fold, y_val_pred, labels=class_labels)
        conf_matrices.append(cm)

        accuracy = accuracy_score(y_val_fold, y_val_pred)
        precision = precision_score(y_val_fold, y_val_pred, average=None, labels=class_labels, zero_division=0)
        recall = recall_score(y_val_fold, y_val_pred, average=None, labels=class_labels, zero_division=0)

        fold_accuracy.append(accuracy)
        fold_precision.append(precision)
        fold_recall.append(recall)
    
    # Calculate metrics
    mean_accuracy = np.mean(fold_accuracy)
    std_accuracy = np.std(fold_accuracy)
    mean_error = 1 - mean_accuracy
    std_error = std_accuracy 
    mean_cm = np.mean(conf_matrices, axis=0).astype(int)
    mean_precision = np.mean(fold_precision, axis=0)
    mean_recall = np.mean(fold_recall, axis=0)


    # Register metrics in MLflow
    # --------------------------------------------------------------
    mlflow.log_metric("mean_accuracy", mean_accuracy)
    mlflow.log_metric("std_accuracy", std_accuracy)
    mlflow.log_metric("mean_classification_error", mean_error)
    mlflow.log_metric("std_classification_error", std_error)

    # Create DataFrames for performance metrics and confusion matrix
    # --------------------------------------------------------------
    df_performance = pd.DataFrame({
        "Criterion": ["Accuracy", "Classification Error"],
        "Value": [f"{mean_accuracy * 100:.1f}%", f"{mean_error * 100:.1f}%"],
        "Standard Deviation": [f"± {std_accuracy * 100:.1f}%", f"± {std_error * 100:.1f}%"]
    })
    df_performance.to_csv("results/performance_metrics.csv")
    mlflow.log_artifact("results/performance_metrics.csv")

    df_conf = pd.DataFrame(mean_cm,
                           index=[f"true {label}" for label in class_labels],
                           columns=[f"pred {label}" for label in class_labels])
    df_conf["class recall"] = [f"{r*100:.2f}%" for r in mean_recall]
    df_conf.loc["class precision"] = [f"{p*100:.2f}%" for p in mean_precision] + [""]
    df_conf.to_csv("results/confusion_matrix_summary.csv")
    mlflow.log_artifact("results/confusion_matrix_summary.csv")

    print("\nEjecución de MLflow completada.")