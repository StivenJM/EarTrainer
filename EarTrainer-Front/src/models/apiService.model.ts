import { Difficulty, Note } from "../types"

// Trainer
// ---------------
export interface SugerirEjercicioRequest {
    userId: number;
    numDistractores: number;
}

export interface SugerirEjercicioResponse {
    objetivo: Note
    distractores: Note[]
}

export interface EntrenarModeloRequest {
    userId: number
    sessionId: number
}

export interface EntrenarModeloResponse {
    success: boolean
    message: string
}

// Sessions
// ---------------
export interface CrearSesionRequest {
    userId: number
    dificultad: Difficulty
}

export interface CrearSesionResponse {
    session_id: number;
}

export interface TerminarSesionResponse {
    success: boolean
    message: string
}

export interface RegistrarIntentoResponse {
    success: boolean
    message: string
}

