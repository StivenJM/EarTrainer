import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    idUser: number
    username: string
    isLoggedIn: boolean
    isPlaying: boolean
}

export const UserEmptyState: UserState = {
    idUser: 0,
    username: '',
    isLoggedIn: false,
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
        startSession: (state) => {
            return {... state, ... {isPlaying: true}}
        },
        endSession: (state) => {
            return {... state, ... {isPlaying: false}}
        }
    }
})

export const { login, logout, startSession, endSession } = userSlice.actions