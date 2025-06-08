import axiosInstance from "./axiosInstance";

export const sendFeedback = async (data) => {
  const response = await axiosInstance.post('/feedback', data);
  return response.data;
};

export const fetchFeedbacksByService = async (serviceId) => {
  const response = await axiosInstance.get(`/feedback/service/${serviceId}`);
  return response.data.feedbacks;
};
