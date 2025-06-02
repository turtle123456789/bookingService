// src/api/userApi.js

import axiosInstance from "./axiosInstance";

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/users/register', userData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Đăng ký thành công:', response.data.message);
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng ký:', error.response?.data || error.message);
    throw error;
  }
};
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post('/users/login', { email, password });

    const { accessToken, refreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    console.log('Đăng nhập thành công');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Lỗi đăng nhập:', error.response?.data || error.message);
    throw error;
  }
};
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/users/profile');
    console.log('Thông tin người dùng:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi lấy profile:', error.response?.data || error.message);
    throw error;
  }
};
