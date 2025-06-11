import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPayments } from '../services/paymentService';

// Thunk: Lấy danh sách thanh toán
export const getPayments = createAsyncThunk(
  'payment/getList',
  async (params, thunkAPI) => {
    try {
      return await fetchPayments(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    loading: false,
    error: null,
    pagination: null
  },
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải danh sách thanh toán';
      });
  }
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
