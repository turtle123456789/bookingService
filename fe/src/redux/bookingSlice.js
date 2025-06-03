import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { approveBookingApi, createBookingApi, getAllBookingsApi } from '../services/bookingApi';

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
// Thunk để lấy toàn bộ danh sách booking
export const getAllBookingsThunk = createAsyncThunk(
  'booking/getAllBookings',
  async (_, thunkAPI) => {
    try {
      const response = await getAllBookingsApi();
      return response; // Trả về mảng booking
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const approveBookingThunk = createAsyncThunk(
  'booking/approveBooking',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await approveBookingApi(id, status);
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
    bookings: [],         
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
      })
      .addCase(getAllBookingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getAllBookingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi lấy danh sách booking';
      })
       .addCase(approveBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        // Cập nhật booking trong danh sách nếu tồn tại
        const index = state.bookings.findIndex(b => b.id === updated.id);
        if (index !== -1) {
          state.bookings[index] = updated;
        }
      })
      .addCase(approveBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi duyệt booking';
      });
  }
});

export const { resetBookingState } = bookingSlice.actions;

export default bookingSlice.reducer;
