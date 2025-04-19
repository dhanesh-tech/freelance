import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';
import userReducer from '../reducers/userReducer';
import cartReducer from '@/reducers/cartReducers';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 