import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createServiceApi } from '../services/serviceApi';
import { fetchServicesApi } from '../services/serviceApi';

// Async thunk gọi API tạo dịch vụ
export const createServiceThunk = createAsyncThunk(
  'service/createService',
  async (serviceData, thunkAPI) => {
    try {
      const response = await createServiceApi(serviceData);
      return response.service; // trả về dữ liệu service vừa tạo
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchServicesThunk = createAsyncThunk(
  'service/fetchServices',
  async (_, thunkAPI) => {
    try {
      const response = await fetchServicesApi(); // gọi API GET /api/services
      return response.services; // giả sử API trả về dạng { services: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    createdService: null,
    loading: false,
    error: null,
  },
  reducers: {
    // bạn có thể thêm reducers nếu cần reset state chẳng hạn
    resetServiceState(state) {
      state.createdService = null;
      state.loading = false;
      state.error = null;
      state.services = [];

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createServiceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.createdService = action.payload;
      })
      .addCase(createServiceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi tạo dịch vụ';
      })
      .addCase(fetchServicesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServicesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi lấy danh sách dịch vụ';
      });
  },
});

export const { resetServiceState } = serviceSlice.actions;

export default serviceSlice.reducer;
