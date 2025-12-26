
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationSettings {
    mealReminders: boolean;
    waterReminders: boolean;
    weighInReminder: boolean;
    proTips: boolean;
    breakfastTime: string; // ISO string
    lunchTime: string; // ISO string
    dinnerTime: string; // ISO string
}

const initialState: NotificationSettings = {
    mealReminders: false,
    waterReminders: false,
    weighInReminder: false,
    proTips: false,
    breakfastTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    lunchTime: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    dinnerTime: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        updateSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
            return { ...state, ...action.payload };
        },
        setAllSettings: (state, action: PayloadAction<NotificationSettings>) => {
            return action.payload;
        }
    },
});

export const { updateSettings, setAllSettings } = notificationsSlice.actions;
export default notificationsSlice.reducer;
