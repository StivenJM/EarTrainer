import axios, { AxiosResponse } from "axios"
import { loadAbort } from "../utilities/loadAbort.utility"
import type { AttemptNotes, Session, User } from "../models"
import { Difficulty, Note, SkillLevel } from "../types"

const VITE_API_URL = import.meta.env.VITE_API_URL

export interface ApiResponse<T> {
    call: Promise<AxiosResponse<T>>
    controller: AbortController
}

// Interfaces
// ---------------
// CreateUser
export interface CreateUserRequest {
  username: string
}

export interface CreateUserResponse {
  user_id: number
  username: string
}

// CreateSession
export interface CreateSessionRequest {
  user_id: number
  dificultad: Difficulty
}

export interface CreateSessionResponse {
  session_id: number
}

// Close Session
export interface CloseSessionRequest {
  session_id: number
}

export interface TerminarSesionResponse {
  success: boolean
  message: string
}

// Resgister Attempt
export interface RegisterAttemptRequest {
  session_id: number
  nota_correcta: Note
  notas_mostradas: Note[]
  nota_elegida: Note
  tiempo_respuesta: number
  es_correcto: boolean
}

// Suggest Exercise
export interface SuggestRequest {
  user_id: number
  num_distractores: number
}

export interface SuggestResponse {
  objetivo: Note
  distractores: Note[]
}

// Train model
export interface TrainModelRequest {
  user_id: number
  session_id: number
}

export interface TrainModelResponse {
  success: boolean
  message: string
}

// Predict Skill
export interface PredictSkillRequest {
    user_id: number
}

export type PredictSkillResponse = 'principiante' | 'intermedio' | 'experto'

// Trainer
// ---------------
export const suggestExercise = (p: SuggestRequest): ApiResponse<AttemptNotes> => {
    const controller = loadAbort()
    return {
        call: axios.post<SuggestResponse>(`${VITE_API_URL}/trainer/sugerir_ejercicio`, 
            p,
            {signal: controller.signal}
        ).then((response): AxiosResponse<AttemptNotes> => {
            return {
                ...response,
                data: {
                    correctNote: response.data.objetivo,
                    shownNotes: response.data.distractores.concat(response.data.objetivo)
                }
            }
        }),
        controller
    }
}

export const trainModel = (p: TrainModelRequest): ApiResponse<null> => {
    const controller = loadAbort()
    return {
        call: axios.post<null>(`${VITE_API_URL}/trainer/entrenar_modelo`, 
            p,
            {signal: controller.signal}
        ),
        controller
    }
}

// Skills
// ---------------
export const predictSkill = (p: PredictSkillRequest): ApiResponse<SkillLevel> => {
    const controller = loadAbort()
    return {
        call: axios.post<PredictSkillResponse>(`${VITE_API_URL}/skill/predict-skill-level/${p.user_id}`, 
            {}, // No body needed as user_id is in the path
            { signal: controller.signal }
        ).then((response): AxiosResponse<SkillLevel> => {
            // Mapea la respuesta de la API (string) a la interfaz deseada
            let mappedSkill: SkillLevel
            switch (response.data) {
                case 'principiante':
                    mappedSkill = 'beginner'
                    break
                case 'intermedio':
                    mappedSkill = 'intermediate'
                    break
                case 'experto':
                    mappedSkill = 'expert'
                    break
                default:
                    mappedSkill = 'beginner' // Default case, should not happen
                    break
            }

            return {
                ...response,
                data: mappedSkill,
            }
        }),
        controller
    }
}


// Sessions
// ---------------
export const createSession = (p: CreateSessionRequest): ApiResponse<Session> => {
    const controller = loadAbort()
    return {
        call: axios.post<CreateSessionResponse>(`${VITE_API_URL}/session/crear`, 
            p,
            {signal: controller.signal}
        ).then((response): AxiosResponse<Session> => {
            return {
                ...response,
                data: {
                    sessionId: response.data.session_id
                }
            }
        }),
        controller
    }
}

export const closeSession = (p: CloseSessionRequest): ApiResponse<null> => {
    const controller = loadAbort()
    return {
        call: axios.post<null>(`${VITE_API_URL}/session/terminar`, 
            p,
            {signal: controller.signal}
        ),
        controller
    }
}

export const registerAttempt = (p: RegisterAttemptRequest): ApiResponse<null> => {
    const controller = loadAbort()
    return {
        call: axios.post<null>(`${VITE_API_URL}/session/registrar_intento`, 
            p,
            {signal: controller.signal}
        ),
        controller
    }
}


// Users
// ---------------
export const createUser = (p: CreateUserRequest): ApiResponse<User> => {
    const controller = loadAbort()
    return {
        call: axios.post<CreateUserResponse>(`${VITE_API_URL}/user/crear_usuario`, 
            p,
            {signal: controller.signal}
        ).then((response): AxiosResponse<User> => {
            return {
                ...response,
                data: {
                    userId: response.data.user_id,
                    username: response.data.username
                }
            }
        }),
        controller
    }
}