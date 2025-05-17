// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './index';

const store = configureStore({
  reducer: rootReducer,
  // This automatically sets up the Redux DevTools extension
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;