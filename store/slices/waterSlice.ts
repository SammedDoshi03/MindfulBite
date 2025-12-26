
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WaterState {
    intake: number;
    goal: number;
    date: string; // ISO date string YYYY-MM-DD
}

const initialState: WaterState = {
    intake: 0,
    goal: 2500,
    date: new Date().toISOString().split('T')[0],
};

const waterSlice = createSlice({
    name: 'water',
    initialState,
    reducers: {
        addWater: (state, action: PayloadAction<number>) => {
            state.intake = Math.min(state.intake + action.payload, state.goal + 1000);
        },
        setGoal: (state, action: PayloadAction<number>) => {
            state.goal = action.payload;
        },
        resetWater: (state) => {
            state.intake = 0;
        },
        setWaterState: (state, action: PayloadAction<WaterState>) => {
            state.intake = action.payload.intake;
            state.goal = action.payload.goal;
            state.date = action.payload.date;
        },
        updateDate: (state, action: PayloadAction<string>) => {
            state.date = action.payload;
            state.intake = 0; // Reset intake on new date
        }
    },
});

export const { addWater, setGoal, resetWater, setWaterState, updateDate } = waterSlice.actions;
export default waterSlice.reducer;
