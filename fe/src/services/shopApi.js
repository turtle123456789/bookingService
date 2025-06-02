
import axiosInstance from './axiosInstance';

export const getPublicShops = async () => {
  const response = await axiosInstance.get('/shops');
  return response.data;
};
