import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoryReducer from './categorySlice'
import shopReducer from './shopSlice'
import serviceReducer from './serviceSlice'
import bookingReducer from './bookingSlice'
import feedbaclReducer from './feedbackSlice'
const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    shops: shopReducer,
    service: serviceReducer,
    booking: bookingReducer,
    feedback: feedbaclReducer
  },
});

export default store;
