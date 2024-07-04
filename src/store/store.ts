import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

import user from './userReducer'
import { useDispatch, useSelector as useAppSelector, TypedUseSelectorHook } from 'react-redux';

const reducers = combineReducers({
  user,
});

const persistConfig = {
  key: 'root',
  middleware: [],
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  // middleware: [thunk] as any
})
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // 
export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector


export const persistor = persistStore(store);