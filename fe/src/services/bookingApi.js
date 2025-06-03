
import axiosInstance from './axiosInstance';

export const createBookingApi = async (bookingData) => {
  const response = await axiosInstance.post('/bookings', bookingData);
  return response.data;
};
