
import axiosInstance from './axiosInstance';
export const createCategory = async (data) => {
  const response = await axiosInstance.post('/categories', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};