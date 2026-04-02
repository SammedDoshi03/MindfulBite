import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from 'redux-persist';
import { reduxStorage } from './mmkv';
import authReducer from './slices/authSlice';
import logReducer from './slices/logSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';
import waterReducer from './slices/waterSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  log: logReducer,
  water: waterReducer,
  notifications: notificationsReducer,
});

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['auth', 'log', 'water', 'ui', 'notifications'], // Persist core elements
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For non-serializable data in actions (including persist actions)
    }),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
