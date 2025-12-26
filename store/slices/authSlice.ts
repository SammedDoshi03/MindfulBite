import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    name: string;
    email: string;
    height?: number;
    weight?: number;
    age?: number;
    gender?: string;
    goal?: string; // e.g. 'lose_weight'
    dietaryPreferences?: string[];
    calorieTarget?: number;
    waterTarget?: number;
    photoUri?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isOnboarded: boolean;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isOnboarded: false,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
        },
        completeOnboarding: (state) => {
            state.isOnboarded = true;
        },
    },
});

export const { setUser, updateUser, setToken, logout, completeOnboarding } = authSlice.actions;
export default authSlice.reducer;
