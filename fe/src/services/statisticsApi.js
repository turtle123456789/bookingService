import axiosInstance from './axiosInstance';

export const fetchAdminStatistics = async () => {
  const res = await axiosInstance.get('/statistics');
  return res.data;
};

export const fetchRevenueData = async (params) => {
  const res = await axiosInstance.get('/statistics/revenue', { params });
  return res.data;
};