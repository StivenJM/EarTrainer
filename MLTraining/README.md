# MLTraining: Machine Learning Model Development

This directory is dedicated to the development, experimentation, and training of the **machine learning models** used in the EarTrainer project. Specifically, it focuses on the **player skill prediction model**, leveraging tools like **MLflow** for robust versioning and performance tracking.

---

## Table of Contents

* [Overview of Workflow](#overview-of-workflow)
* [Key Files and Their Purpose](#key-files-and-their-purpose)
* [Technologies Used](#technologies-used)
* [Getting Started](#getting-started)
* [Results and Evaluation](#results-and-evaluation)

---

## Overview of Workflow

The machine learning workflow in this section follows a structured approach from initial experimentation to production model training:

* **Exploration and Prototyping**: Initial model development and evaluation are performed in a **Jupyter Notebook** environment.
* **Experimentation and Versioning**: The training flow is then translated into a **Python script**, integrated with **MLflow**, to systematically track and compare various model iterations and hyperparameters.
* **Production Model Training**: Once the optimal model is identified (**SVM with RBF kernel**), a dedicated script trains this model on the complete dataset, also using MLflow for production-ready versioning.

---

## Key Files and Their Purpose

* `music_skills.ipynb`: This **Jupyter Notebook** serves as the initial exploration and prototyping environment. It demonstrates the end-to-end training flow, including data loading, preprocessing, model definition, training, and basic metric evaluation. It's ideal for understanding the core logic and quick iterations.
* `music_skills.py`: This **Python script** implements the same training flow as the notebook but crucially integrates with **MLflow**. Its primary purpose is to enable systematic experimentation and versioning of different machine learning models. By simply changing parameters, developers can evaluate multiple models, track their performance, and compare results effectively, leading to informed model selection.
* `music_skills_production.py`: After extensive experimentation and selection of the best performing model (an **SVM with an RBF kernel** in this case), this script is used to train the final **production model**. It also leverages **MLflow** to version this specific production-ready model, ensuring that the exact model deployed can be reproduced and tracked. This script trains the model using the entire available dataset.
* `musical_skills_smote_final.csv`: This CSV file serves as the **input dataset** for all training processes within this directory. It is the cleaned, transformed, and balanced dataset prepared in the Data directory.
* `requirements.txt`: Lists all Python dependencies required to run the scripts and notebooks in this directory.
* `results/`: This directory stores output files from model evaluations, such as:
    * `confusion_matrix_summary.csv`: Provides details on the classification performance, including true positives, true negatives, false positives, and false negatives.
    * `performance_metrics.csv`: Contains key performance indicators (e.g., accuracy, precision, recall, F1-score) for the trained models.

---

## Technologies Used

* **Python**: The primary programming language for all scripts and notebooks.
* **Jupyter Notebook**: For interactive development, exploration, and prototyping (`.ipynb` files).
* **Scikit-learn**: A robust machine learning library used for implementing the SVM and logistic regression models.
* **MLflow**: An open-source platform for managing the end-to-end machine learning lifecycle, including experiment tracking, model versioning, and model deployment.
* **Pandas**: For data manipulation and analysis.
* **NumPy**: For numerical operations.

---

## Getting Started

To run the experiments or retrain the models:

1.  Ensure dependencies are installed:

    ```bash
    pip install -r requirements.txt
    ```

2.  For interactive exploration:

    ```bash
    jupyter notebook music_skills.ipynb
    ```

3.  To run experiments with MLflow:

    ```bash
    python music_skills.py
    # Or to run the production training
    python music_skills_production.py
    ```
    (Ensure you have an MLflow tracking server configured or run `mlflow ui` in the root of your project to view runs locally.)

---

## Results and Evaluation

The `results/` directory provides insights into the model's performance. These metrics are crucial for understanding the model's effectiveness in predicting player skill and its ability to adapt to new data.