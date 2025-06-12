import axiosInstance from './axiosInstance';

export const createServiceApi = async (serviceData) => {
  const response = await axiosInstance.post('/services', serviceData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  return response.data;
};
export const fetchServicesApi = async (serviceData) => {
  const response = await axiosInstance.get('/services');
  return response.data;
};

export const updateServiceApi = async (id, serviceData) => {
  const response = await axiosInstance.put(`/services/${id}`, serviceData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  return response.data;
};

// Xóa dịch vụ
export const deleteServiceApi = async (id) => {
  const response = await axiosInstance.delete(`/services/${id}`);
  return response.data;
};