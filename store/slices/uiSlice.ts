import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    theme: 'light' | 'dark';
    isLoading: boolean;
    error: string | null;
}

const initialState: UiState = {
    theme: 'dark', // Default to dark for premium feel
    isLoading: false,
    error: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setTheme, setLoading, setError } = uiSlice.actions;
export default uiSlice.reducer;
