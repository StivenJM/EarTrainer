import axios from "axios"
import { loadAbort } from "../utilities/loadAbort.utility";
import type { UseApiCall } from "../models/useApi.model";

const VITE_API_URL = import.meta.env.VITE_API_URL

// Trainer
// ---------------
export const sugerirEjercicio = (userId: number, numDistractores: number): UseApiCall<null> => {
    const controller = loadAbort()
    return {
        call: axios.post<null>(`${VITE_API_URL}/trainer/sugerir_ejercicio`, 
            { 
                user_id: userId,
                num_distractores: numDistractores
            },
            {signal: controller.signal}
        ),
        controller
    }
}

export const entrenarModelo = (userId: number, sessionId: number): UseApiCall<null> => {
    const controller = loadAbort()
    return {
        call: axios.post<null>(`${VITE_API_URL}/trainer/entrenar_modelo`, 
            { 
                user_id: userId,
                session_id: sessionId
            },
            {signal: controller.signal}
        ),
        controller
    }
}


// Sessions
// ---------------
export const crearSesion = (userId: number, dificultad: string): UseApiCall<null> => {
    const controller = loadAbort()
    return {
        call: axios.post<null>(`${VITE_API_URL}/session/crear`, 
            { 
                user_id: userId,
                dificultad: dificultad
            },
            {signal: controller.signal}
        ),
        controller
    }
}

export const terminarSesion = (sessionId: number): UseApiCall<null> => {
    const controller = loadAbort()
    return {
        call: axios.post<null>(`${VITE_API_URL}/session/terminar`, 
            { 
                session_id: sessionId
            },
            {signal: controller.signal}
        ),
        controller
    }
}

export const registrarIntento = (
    sessionId: number,
    notaCorrecta: string,
    notasMostradas: string[],
    notaElegida: string,
    tiempoRespuesta: number,
    esCorrecto: boolean
): UseApiCall<null> => {
    const controller = loadAbort()
    return {
        call: axios.post<null>(`${VITE_API_URL}/session/registrar_intento`, 
            { 
                session_id: sessionId,
                nota_correcta: notaCorrecta,
                notas_mostradas: notasMostradas,
                nota_elegida: notaElegida,
                tiempo_respuesta: tiempoRespuesta,
                es_correcto: esCorrecto
            },
            {signal: controller.signal}
        ),
        controller
    }
}


// Users
// ---------------
export const crearUsuario = (username: string): UseApiCall<null> => {
    const controller = loadAbort()
    return {
        call: axios.post<null>(`${VITE_API_URL}/user/crear_usuario`, 
            { 
                username: username
            },
            {signal: controller.signal}
        ),
        controller
    }
}