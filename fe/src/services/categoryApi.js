
import axiosInstance from './axiosInstance';
export const createCategory = async (data) => {
  const response = await axiosInstance.post('/categories', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
  };

export const updateCategory = async (id, data) => {
  const response = await axiosInstance.put(`/categories/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateSubCategory = async (id, data) => {
  const response = await axiosInstance.put(`/categories/sub/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};