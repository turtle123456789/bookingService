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

