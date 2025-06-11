
import axiosInstance from './axiosInstance';

export const fetchPayments = async (params) => {
  const response = await axiosInstance.get('/payment', {
    params, // ví dụ: { from_date, to_date, page, limit }
  });
  return response.data;
};
