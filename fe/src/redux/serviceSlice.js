import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createServiceApi, deleteServiceApi, updateServiceApi } from '../services/serviceApi';
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
export const updateServiceThunk = createAsyncThunk(
  'service/updateService',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await updateServiceApi(id, data);
      return response.service;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteServiceThunk = createAsyncThunk(
  'service/deleteService',
  async (id, thunkAPI) => {
    try {
      const response = await deleteServiceApi(id);
      return { id, message: response.message };
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
      })
      .addCase(updateServiceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật dịch vụ trong danh sách nếu đã fetch
        const index = state.services?.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(updateServiceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi cập nhật dịch vụ';
      })

      .addCase(deleteServiceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServiceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services?.filter(s => s.id !== action.payload.id);
      })
      .addCase(deleteServiceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi xóa dịch vụ';
      })
  },
});

export const { resetServiceState } = serviceSlice.actions;

export default serviceSlice.reducer;
