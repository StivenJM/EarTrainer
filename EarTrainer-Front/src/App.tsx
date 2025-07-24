import { useEffect, useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import ScoreScreen from './components/ScoreScreen';
import HighScoresScreen from './components/HighScoresScreen';
import Footer from './components/Footer';
import { GameState } from './types';
import { useApi } from './hooks/useApi';
import { User } from './models';
import { crearUsuario } from './services/api.service';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { login } from './redux/states/user';

function App() {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [arduinoPort, setArduinoPort] = useState<any | null>(null);

  const userApi = useApi<User, string>(crearUsuario)

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const username = useSelector((state: RootState) => state.user.username)
  const userDispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!isLoggedIn || username !== userApi.data?.username) {
      if (userApi.data) {
        // Se guardan los datos del usuario en el estado global
        userDispatch(login({
          idUser: userApi.data?.user_id,
          username: userApi.data?.username,
        }))
      }
    }
  }, [isLoggedIn, username, userApi.data])

  const startGame = (name: string, selectedDifficulty: string, port: any | null) => {
    if (!isLoggedIn || username !== name) {
      userApi.fetch(name)
    }
    setDifficulty(selectedDifficulty);
    setArduinoPort(port);
    setScore(0);
    setTotalQuestions(0);
    setGameState('playing');
  };

  const endGame = (finalScore: number, finalTotalQuestions: number) => {
    setScore(finalScore);
    setTotalQuestions(finalTotalQuestions);
    setGameState('scores');
  };

  const returnToWelcome = () => {
    setGameState('welcome');
  };

  const showHighScores = () => {
    setGameState('highScores');
  };

  const exitGame = () => {
    setGameState('welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 text-gray-800 font-sans flex flex-col">
      <div className="flex-1">
        {gameState === 'welcome' && (
          <WelcomeScreen onStartGame={startGame} onShowHighScores={showHighScores} />
        )}
        {gameState === 'playing' && (
          <GameScreen 
            key={`GameScreen-${gameState}`}
            playerName={userApi.data?.username || ''} 
            difficulty={difficulty} 
            arduinoPort={arduinoPort}
            onEndGame={endGame}
            onExitGame={exitGame}
          />
        )}
        {gameState === 'scores' && (
          <ScoreScreen 
            playerName={userApi.data?.username || ''} 
            score={score} 
            totalQuestions={totalQuestions}
            difficulty={difficulty}
            onPlayAgain={returnToWelcome}
          />
        )}
        {gameState === 'highScores' && (
          <HighScoresScreen onBack={returnToWelcome} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;