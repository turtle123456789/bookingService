import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoryReducer from './categorySlice'
import shopReducer from './shopSlice'
const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    shops: shopReducer
  },
});

export default store;
