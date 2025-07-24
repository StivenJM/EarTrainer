import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import OwlCharacter from './OwlCharacter'
import { ScoreEntry } from '../types'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

interface ScoreScreenProps {
  score: number
  totalQuestions: number
  difficulty: string
  onPlayAgain: () => void
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ 
  score, 
  totalQuestions,
  difficulty,
  onPlayAgain 
}) => {
  // Redux state
  const username = useSelector((state: RootState) => state.user.username)

  const [highScores, setHighScores] = useState<ScoreEntry[]>([])
  const percentage = Math.round((score / totalQuestions) * 100)
  const [owlMood, setOwlMood] = useState<'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging'>('celebrating')
  const [owlMessage, setOwlMessage] = useState('')
  const [scoreSaved, setScoreSaved] = useState(false)
  const [sessionId] = useState(() => `${username}-${Date.now()}-${Math.random()}`)
  
  useEffect(() => {
    // Set owl message based on performance
    if (percentage === 100) {
      setOwlMood('celebrating')
      setOwlMessage('¡PERFECTO! ¡Eres un genio musical! No te equivocaste ni una sola vez. ¡Increíble!')
    } else if (percentage >= 80) {
      setOwlMood('celebrating')
      setOwlMessage('¡Excelente trabajo! Tienes un oído musical fantástico. ¡Sigue practicando!')
    } else if (percentage >= 60) {
      setOwlMood('happy')
      setOwlMessage('¡Muy bien! Vas por buen camino. Con más práctica serás un experto.')
    } else {
      setOwlMood('encouraging')
      setOwlMessage('¡No te rindas! Cada error te ayuda a aprender. ¡La próxima vez lo harás mejor!')
    }
    
    // Get existing scores from localStorage
    const existingScores = localStorage.getItem('musicalEarHighScores')
    let scores: ScoreEntry[] = existingScores ? JSON.parse(existingScores) : []
    
    // Add current score with unique session ID
    const newScore: ScoreEntry = {
      playerName: username,
      score,
      totalQuestions,
      percentage,
      difficulty,
      date: new Date().toLocaleString(),
      timestamp: Date.now(),
      sessionId
    }

    if (!scoreSaved) {
      if (!scores.some(s => s.sessionId === newScore.sessionId)) {
        scores.push(newScore)
        setScoreSaved(true)
      }
    }
    
    // Sort by percentage (highest first), then by difficulty
    scores.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage
      }
      // If same percentage, prioritize harder difficulties
      const difficultyOrder = { 'hard': 3, 'medium': 2, 'easy': 1 }
      return difficultyOrder[b.difficulty as keyof typeof difficultyOrder] - 
             difficultyOrder[a.difficulty as keyof typeof difficultyOrder]
    })
    
    // Keep only top 10 scores
    scores = scores.slice(0, 10)
    
    // Save back to localStorage
    localStorage.setItem('musicalEarHighScores', JSON.stringify(scores))
    
    // Update state
    setHighScores(scores)
  }, [username, score, totalQuestions, percentage, difficulty, scoreSaved, sessionId])

  // Function to get appropriate message based on score percentage
  const getFeedbackMessage = () => {
    if (percentage === 100) return '¡Perfecto! Tienes un oído musical extraordinario.'
    if (percentage >= 90) return '¡Excelente! Tienes un oído musical extraordinario.'
    if (percentage >= 70) return '¡Muy bien! Tienes buen oído musical.'
    if (percentage >= 50) return 'Buen trabajo. Con más práctica mejorarás.'
    return 'Sigue practicando. El oído musical se desarrolla con tiempo.'
  }

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy': return 'Fácil'
      case 'medium': return 'Media'
      case 'hard': return 'Difícil'
      default: return diff
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fadeIn bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 relative overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

      </div>

      {/* Búho celebrando */}
      <OwlCharacter
        mood={owlMood}
        message={owlMessage}
        isVisible={true}
      />

      <div className="w-full max-w-4xl bg-gradient-to-br from-white via-yellow-50 to-pink-50 rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-rainbow relative">
        {/* <style jsx>{`
          .border-rainbow {
            border-image: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd) 1
          }
        `}</style> */}
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="text-8xl animate-bounce">🏆</div>
            {percentage === 100 && (
              <div className="absolute -top-4 -right-4 text-4xl animate-spin">👑</div>
            )}
            {percentage >= 80 && (
              <>
                <div className="absolute -top-2 -left-2 text-2xl animate-pulse">⭐</div>
                <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce">🌟</div>
              </>
            )}
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          ¡Juego Terminado!
        </h1>
        
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-3xl p-8 mb-8 text-center border-4 border-purple-300 relative overflow-hidden">
          {/* Efectos de celebración */}
          {percentage >= 80 && (
            <>
             
            </>
          )}
          
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Tu Puntuación</h2>
          <div className="text-6xl font-black bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent mb-4">
            {score}/{totalQuestions}
          </div>
          <div className="text-4xl font-black mb-4">
            <span className={`${percentage >= 80 ? 'text-green-500' : percentage >= 60 ? 'text-yellow-500' : 'text-orange-500'}`}>
              {percentage}%
            </span>
          </div>
          <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold mb-4 ${getDifficultyColor(difficulty)}`}>
            {getDifficultyLabel(difficulty)}
          </div>
          <p className="text-purple-700 text-xl font-bold">{getFeedbackMessage()}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">Mejores Jugadores</h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden border-2 border-purple-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-200 to-pink-200">
                  <th className="px-4 py-3 text-left text-lg font-bold text-purple-800">#</th>
                  <th className="px-4 py-3 text-left text-lg font-bold text-purple-800">Nombre</th>
                  <th className="px-4 py-3 text-center text-lg font-bold text-purple-800">Nivel</th>
                  <th className="px-4 py-3 text-right text-lg font-bold text-purple-800">Puntos</th>
                  <th className="px-4 py-3 text-right text-lg font-bold text-purple-800">%</th>
                </tr>
              </thead>
              <tbody>
                {highScores.map((entry, index) => (
                  <tr 
                    key={entry.sessionId || `${entry.playerName}-${entry.timestamp}-${index}`}
                    className={`border-t-2 border-purple-200 ${
                      entry.sessionId && entry.sessionId.includes(username) && 
                      entry.score === score && entry.difficulty === difficulty
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300' : 'hover:bg-purple-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-lg font-bold">
                      {index === 0 && <span className="text-2xl">🥇</span>}
                      {index === 1 && <span className="text-2xl">🥈</span>}
                      {index === 2 && <span className="text-2xl">🥉</span>}
                      {index > 2 && <span className="text-purple-600">{index + 1}</span>}
                    </td>
                    <td className="px-4 py-3 text-lg font-bold text-purple-700">{entry.playerName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(entry.difficulty)}`}>
                        {getDifficultyLabel(entry.difficulty)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-lg font-bold text-right text-green-600">{entry.score}/{entry.totalQuestions}</td>
                    <td className="px-4 py-3 text-lg font-bold text-right text-blue-600">{entry.percentage}%</td>
                  </tr>
                ))}
                {highScores.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-purple-500 text-lg font-semibold">
                      ¡Sé el primero en aparecer aquí!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={onPlayAgain}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-xl"
          >
            <ArrowLeft size={24} className="mr-3" />
            ¡Jugar otra vez!
          </button>
        </div>

        {/* Decoraciones en las esquinas */}

      </div>
    </div>
  )
}

export default ScoreScreen