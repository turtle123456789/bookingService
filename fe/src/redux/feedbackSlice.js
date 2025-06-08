import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendFeedback, fetchFeedbacksByService } from '../services/feedbackService';

// Gửi feedback
export const createFeedback = createAsyncThunk(
  'feedback/create',
  async ( {serviceId,rating,comment}, thunkAPI) => {
     const data = {serviceId,rating,comment}
    try {
      return await sendFeedback(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Lấy tất cả feedback theo serviceId
export const getFeedbacksByService = createAsyncThunk(
  'feedback/getByService',
  async (serviceId, thunkAPI) => {
    try {
      return await fetchFeedbacksByService(serviceId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedbacks',
  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearFeedbackMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks.unshift(action.payload.feedback);
        state.successMessage = action.payload.message;
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Gửi đánh giá thất bại';
      })

      .addCase(getFeedbacksByService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedbacksByService.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(getFeedbacksByService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải đánh giá';
      });
  }
});

export const { clearFeedbackMessage } = feedbackSlice.actions;
export default feedbackSlice.reducer;
