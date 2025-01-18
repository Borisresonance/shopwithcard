import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import storage from 'redux-persist/lib/storage'; // Usa localStorage
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['loading', 'error', 'productById'],
};
const persistedReducer = persistReducer(persistConfig, productsReducer);

const rootReducer = combineReducers({
  products: persistedReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
