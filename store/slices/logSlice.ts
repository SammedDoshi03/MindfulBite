import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoggedMeal {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    imageUri?: string;
    timestamp: number;
}

interface LogState {
    meals: LoggedMeal[];
}

const initialState: LogState = {
    meals: [],
};

const logSlice = createSlice({
    name: 'log',
    initialState,
    reducers: {
        addMeal: (state, action: PayloadAction<LoggedMeal>) => {
            state.meals.unshift(action.payload); // Add to top
        },
        resetLog: (state) => {
            state.meals = [];
        },
        setLogState: (state, action: PayloadAction<LoggedMeal[]>) => {
            state.meals = action.payload;
        }
    },
});

export const { addMeal, resetLog, setLogState } = logSlice.actions;
export default logSlice.reducer;
