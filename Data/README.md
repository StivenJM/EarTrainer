# Data Processing for EarTrainer

This directory contains all the essential components and scripts for preparing the data used in the EarTrainer project's machine learning models. The process involves several key steps including data transformation, cleaning, and augmentation to ensure optimal model performance.

## Data Processing Workflow

The data undergoes a systematic pipeline to be ready for model training:

1.  **Initial Dataset**: The starting point is `musical_skills_dataset_original.csv`, which contains the raw data collected for the project.

2.  **Balancing with SMOTE**: To address potential class imbalance, the dataset is processed using the Synthetic Minority Over-sampling Technique (SMOTE). This step is managed by the `oversampling.ipynb` Jupyter notebook. The output of this process is `musical_skills_oversampled_smote.csv`.

3.  **Feature Refinement and Normalization**: Irrelevant or highly correlated columns are removed to streamline the dataset. Subsequently, the remaining features are normalized using the z-score standardization method. This refined dataset is saved as `musical_skills_smote_final.csv`.

4.  **Randomization for Training**: To ensure robust model training and prevent any order-based biases, the data within `musical_skills_smote_final.csv` is randomly shuffled. This randomization is performed using the `shuffle.ipynb` notebook.