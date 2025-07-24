import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    userId: number
    username: string
    isLoggedIn: boolean
    sessionId: number
    isPlaying: boolean
}

export const UserEmptyState: UserState = {
    userId: 0,
    username: '',
    isLoggedIn: false,
    sessionId: 0,
    isPlaying: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState: UserEmptyState,
    reducers: {
        login: (state, action) => {
            return {... state, ... action.payload, ... {isLoggedIn: true}}
        },
        logout: () => {
            return UserEmptyState
        },
        startSession: (state, action) => {
            return {... state, ... action.payload, ... {isPlaying: true}}
        },
        endSession: (state) => {
            return {... state, ... {idSession: UserEmptyState.sessionId, isPlaying: UserEmptyState.isPlaying}}
        }
    }
})

export const { login, logout, startSession, endSession } = userSlice.actions