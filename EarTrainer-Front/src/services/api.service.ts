import axios from "axios"
import { loadAbort } from "../utilities/loadAbort.utility";
import type { UseApiCall, Intento, User } from "../models";
import { CrearSesionRequest, CrearSesionResponse, EntrenarModeloRequest, EntrenarModeloResponse, RegistrarIntentoResponse, SugerirEjercicioRequest, SugerirEjercicioResponse, TerminarSesionResponse } from "../models/apiService.model";

const VITE_API_URL = import.meta.env.VITE_API_URL

// Trainer
// ---------------
export const sugerirEjercicio = (p: SugerirEjercicioRequest): UseApiCall<SugerirEjercicioResponse> => {
    const controller = loadAbort()
    return {
        call: axios.post<SugerirEjercicioResponse>(`${VITE_API_URL}/trainer/sugerir_ejercicio`, 
            { 
                user_id: p.userId,
                num_distractores: p.numDistractores
            },
            {signal: controller.signal}
        ),
        controller
    }
}

export const entrenarModelo = (p: EntrenarModeloRequest): UseApiCall<EntrenarModeloResponse> => {
    const controller = loadAbort()
    return {
        call: axios.post<EntrenarModeloResponse>(`${VITE_API_URL}/trainer/entrenar_modelo`, 
            { 
                user_id: p.userId,
                session_id: p.sessionId
            },
            {signal: controller.signal}
        ),
        controller
    }
}


// Sessions
// ---------------
export const crearSesion = (p: CrearSesionRequest): UseApiCall<CrearSesionResponse> => {
    const controller = loadAbort()
    return {
        call: axios.post<CrearSesionResponse>(`${VITE_API_URL}/session/crear`, 
            { 
                user_id: p.userId,
                dificultad: p.dificultad
            },
            {signal: controller.signal}
        ),
        controller
    }
}

export const terminarSesion = (sessionId: number): UseApiCall<TerminarSesionResponse> => {
    const controller = loadAbort()
    return {
        call: axios.post<TerminarSesionResponse>(`${VITE_API_URL}/session/terminar`, 
            { 
                session_id: sessionId
            },
            {signal: controller.signal}
        ),
        controller
    }
}

export const registrarIntento = (intento: Intento): UseApiCall<RegistrarIntentoResponse> => {
    const controller = loadAbort()
    return {
        call: axios.post<RegistrarIntentoResponse>(`${VITE_API_URL}/session/registrar_intento`, 
            { 
                session_id: intento.sessionId,
                nota_correcta: intento.notaCorrecta,
                notas_mostradas: intento.notasMostradas,
                nota_elegida: intento.notaElegida,
                tiempo_respuesta: intento.tiempoRespuesta,
                es_correcto: intento.esCorrecto
            },
            {signal: controller.signal}
        ),
        controller
    }
}


// Users
// ---------------
export const crearUsuario = (username: string): UseApiCall<User> => {
    const controller = loadAbort()
    return {
        call: axios.post<User>(`${VITE_API_URL}/user/crear_usuario`, 
            { 
                username: username
            },
            {signal: controller.signal}
        ),
        controller
    }
}