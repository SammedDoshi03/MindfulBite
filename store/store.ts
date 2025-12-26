import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// import { geminiApi } from './api/geminiApi';
import authReducer from './slices/authSlice';
import logReducer from './slices/logSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';
import waterReducer from './slices/waterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    log: logReducer,
    water: waterReducer,
    notifications: notificationsReducer,
    // [geminiApi.reducerPath]: geminiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For non-serializable data in actions if needed
    }),
  // .concat(geminiApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
