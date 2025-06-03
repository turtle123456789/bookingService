import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBookingApi } from '../services/bookingApi';

// Thunk để gọi API tạo booking
export const createBookingThunk = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, thunkAPI) => {
    try {
      const response = await createBookingApi(bookingData);
      return response.booking; // giả sử API trả về { booking: {...} }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    createdBooking: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetBookingState(state) {
      state.createdBooking = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.createdBooking = action.payload;
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi tạo booking';
      });
  }
});

export const { resetBookingState } = bookingSlice.actions;

export default bookingSlice.reducer;
