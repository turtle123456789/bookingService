import axiosInstance from './axiosInstance';

export const getPublicShops = async (params = {}) => {
  const response = await axiosInstance.get('/shops', {
    params, // truyền query vào axios
  });
  return response.data;
};
