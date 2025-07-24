import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./states/user";

export const store = configureStore({
    reducer: {
        user: userSlice.reducer
    }
})

// Types RootState y AppDispatch to use in the whole app
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch