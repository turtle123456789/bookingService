  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import { getProfile, loginUser, registerUser } from '../services/userApi';

  export const registerUserThunk = createAsyncThunk(
    'user/register',
    async (userData, thunkAPI) => {
      try {
        const response = await registerUser(userData);
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  // Async thunk đăng nhập
  export const loginUserThunk = createAsyncThunk(
    'user/login',
    async ({ email, password }, thunkAPI) => {
      try {
        const tokens = await loginUser(email, password);
        return tokens;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  // Async thunk lấy profile
  export const getProfileThunk = createAsyncThunk(
    'user/getProfile',
    async (_, thunkAPI) => {
      try {
        const profile = await getProfile();
        return profile;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  const userSlice = createSlice({
    name: 'user',
    initialState: {
      userInfo: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,
    },
    reducers: {
      logout: (state) => {
        state.userInfo = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },
    extraReducers: (builder) => {
      builder
        // Register
        .addCase(registerUserThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(registerUserThunk.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(registerUserThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Đăng ký thất bại';
        })

        // Login
        .addCase(loginUserThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUserThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken); 
          state.error = null;
        })
        .addCase(loginUserThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Đăng nhập thất bại';
        })

        // Get Profile
        .addCase(getProfileThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getProfileThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.userInfo = action.payload;
        })
        .addCase(getProfileThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Lấy profile thất bại';
        });
    },
  });

  export const { logout } = userSlice.actions;

  export default userSlice.reducer;
