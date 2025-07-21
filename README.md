# Proyecto EarTrainer

This repository contains the full project for EarTrainer, a web application designed to help users improve their musical ear. The application offers an interactive and engaging way to practice recognizing musical notes.

## Table of Contents

* [About the Project](#about-the-project)
* [How the Application Works](#how-the-application-works)
* [Project Structure](#project-structure)
* [Machine Learning Integration](#machine-learning-integration)
* [Getting Started](#getting-started)

## About the Project

The project consists of a web application that aims to improve the player's musical ear. It provides a fun and interactive environment for users, especially children, to practice identifying musical notes.

## How the Application Works

Basically, the player has an initial screen where they must enter their name and the level they want to play with. There are 3 levels: Easy, Medium, and Difficult. The application has a small tutorial that tells the player what the game is about. To start, the game consists of 5 rounds, and points are accumulated in each round; the idea is for the player to have the best score.

Each round consists of the application playing and showing a musical scale, and at the end, it plays the musical note that it wants the player to recognize. Then, the player must select the musical note on the piano. Each level changes in the number of notes shown to the player: in the easy level, 3 notes are shown; in the medium level, 4 notes are shown; and in the difficult level, all 7 notes are shown. The game only consists of 7 notes because it is intended for children.

## Project Structure

The project consists of a Backend and a Frontend. But in the GitHub repository, you can also find files on how the models were trained and what data cleaning was performed.

* **EarTrainer-Back**: Contains the backend services and logic for the application. You can find its structure detailed in its specific `README.md`.
* **EarTrainer-Front**: Houses the frontend user interface. Its structure is detailed in its specific `README.md`.
* **Data**: Includes various versions of the same dataset used for training, such as `musical_skills_dataset_original.csv`, and Jupyter notebooks for data processing like `oversampling.ipynb`.
* **MLTraining**: Contains scripts and notebooks for machine learning model training, including `music_skills.ipynb` and `music_skills_production.py`, along with results directories.

For a detailed breakdown of each component, please refer to the respective `README.md` files within the `EarTrainer-Back`, `EarTrainer-Front`, `Data`, and `MLTraining` directories.

## Machine Learning Integration

Machine Learning is used in two occasions in the project.

1.  **User Skill Level Recommendation**: There is an SVM model that predicts a player's skill level (beginner, intermediate, or expert) and recommends playing the easy, medium, or difficult level based on that skill level.
2.  **Adaptive Note Prediction**: The second model, logistic regression, is an online learning model, meaning it can be retrained with new data. This model is designed to improve as the user plays; it learns from the user and adjusts more to them. Its purpose is to predict which musical note the user is most likely to make a mistake on and which distracting notes are most convenient. This prediction is used to show those notes to the user with the goal of helping them learn better.

## Getting Started

Further instructions on setting up and running the Backend and Frontend, as well as details on the data and ML training processes, can be found in their respective sub-directories' README files.