import { Note } from "../types";

/**
 * Represents a player's attempt in a game round.
 */
export interface Attempt {
    sessionId: number
    correctNote: Note
    shownNotes: Note[]
    selectedNote: Note
    responseTime: number
    isCorrect: boolean
}

export interface AttemptNotes {
    correctNote: Note
    shownNotes: Note[]
}

export interface Session {
    sessionId: number
}

export interface User {
    userId: number
    username: string
}
