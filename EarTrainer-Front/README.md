# EarTrainer-Front: Interactive User Interface

This directory contains the frontend application for EarTrainer, built with **React** and **Vite**. It is responsible for rendering the entire user interface, providing an engaging and interactive experience for players to improve their musical ear.

---

## Table of Contents

* [Key Technologies](#key-technologies)
* [Core Components](#core-components)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Running the Application](#running-the-application)

---

## Key Technologies

* **React**: A declarative, component-based JavaScript library for building user interfaces. It enables the creation of dynamic and responsive web pages.
* **Vite**: A next-generation frontend tooling that provides an extremely fast development experience with features like instant server start and lightning-fast Hot Module Replacement (HMR).
* **TypeScript**: A superset of JavaScript that adds static typing, improving code quality, readability, and maintainability.
* **Tailwind CSS**: A utility-first CSS framework that allows for rapid UI development by composing classes directly in your markup.

---

## Core Components

The `src/components` directory houses the modular building blocks of the application's UI:

* `WelcomeScreen.tsx`: The initial entry point for players, handling name input and level selection.
* `TutorialModal.tsx`: Displays a guided tutorial to introduce game mechanics.
* `GameScreen.tsx`: The main game interface where musical notes are presented and player interaction with the piano occurs.
* `Piano.tsx`: The interactive virtual piano component for note selection.
* `Character.tsx` / `OwlCharacter.tsx`: Visual elements that enhance the user experience.
* `ScoreScreen.tsx`: Displays the player's performance and accumulated points after each round.
* `HighScoresScreen.tsx`: Shows top scores, encouraging competition.
* `ArduinoConnect.tsx`: (If applicable) Component for handling potential Arduino connectivity.

---

## Getting Started

To set up and run the EarTrainer frontend on your local machine, follow these steps:

### Prerequisites

* **Node.js** (LTS version recommended)
* **npm** or **yarn** (package manager)

### Installation

1.  Navigate to the frontend directory:

    ```bash
    cd EarTrainer/EarTrainer-Front
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Vite will start a development server, usually at http://localhost:5173. You can then open this URL in your web browser to access the application.