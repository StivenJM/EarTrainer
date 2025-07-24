import { Note } from "../types";

/**
 * Represents a player's attempt in a game round.
 */
export interface Intento {
    sessionId: number;
    notaCorrecta: Note;
    notasMostradas: Note[];
    notaElegida: Note;
    tiempoRespuesta: number;
    esCorrecto: boolean;
}