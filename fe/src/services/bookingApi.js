
import axiosInstance from './axiosInstance';

export const createBookingApi = async (bookingData) => {
  const response = await axiosInstance.post('/bookings', bookingData);
  return response.data;
};
export const getAllBookingsApi = async () => {
  const response = await axiosInstance.get('/bookings');
  return response.data;
};
export const approveBookingApi = async (id, status) => {
  console.log('id, status :>> ', id, status);
  const response = await axiosInstance.patch(`/bookings/${id}/approve`, { status });
  return response.data;
};