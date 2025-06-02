import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoryReducer from './categorySlice'
import shopReducer from './shopSlice'
import serviceReducer from './serviceSlice'
const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    shops: shopReducer,
    service: serviceReducer
  },
});

export default store;
