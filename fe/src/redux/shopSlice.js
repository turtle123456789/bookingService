import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPublicShops } from '../services/shopApi';

// Async thunk để gọi API lấy danh sách các shop (public)
export const fetchShopsThunk = createAsyncThunk(
  'shop/fetchShops',
  async (_, thunkAPI) => {
    try {
      const response = await getPublicShops();
      return response.shops;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    shopList: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.shopList = action.payload;
      })
      .addCase(fetchShopsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi lấy danh sách shop';
      });
  }
});

export default shopSlice.reducer;
