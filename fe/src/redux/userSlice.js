  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import { getProfile, getUsers, loginUser, registerUser, updatePassword, updateProfile, updateUserStatus } from '../services/userApi';

  export const getUsersThunk = createAsyncThunk(
    'user/getUsers',
    async (_, thunkAPI) => {
      try {
        const users = await getUsers();
        return users;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );
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
export const updateUserStatusThunk = createAsyncThunk(
  'user/updateStatus',
  async ({ userId, status, isActive }, thunkAPI) => {
    try {
      // Gửi dữ liệu cập nhật status và isActive (có hoặc không)
      const payload = {};
      if (typeof status !== 'undefined') payload.status = status;
      if (typeof isActive !== 'undefined') payload.isActive = isActive;

      const response = await updateUserStatus(userId, payload);
      return { userId, ...payload, message: response.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updateProfileThunk = createAsyncThunk(
  'user/updateProfile',
  async (formData, thunkAPI) => {
    console.log('formData :>> ', formData);
    try {
      const updatedUser = await updateProfile(formData);
      return updatedUser.user; // hoặc updatedUser nếu bạn muốn trả nguyên object chứa message
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updatePasswordThunk = createAsyncThunk(
  'user/updatePassword',
  async ({ oldPassword, newPassword }, thunkAPI) => {
    try {
      const response = await updatePassword({ oldPassword, newPassword });
      return response; // có thể chỉ trả về message hoặc dữ liệu tùy API
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
      usersList: [],    
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
        })
        .addCase(updateUserStatusThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateUserStatusThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          if (state.userInfo && state.userInfo.id === action.payload.userId) {
            state.userInfo.status = action.payload.status;
          }
        })
        .addCase(updateUserStatusThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Cập nhật trạng thái người dùng thất bại';
        })
        .addCase(getUsersThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getUsersThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.usersList = action.payload; // thêm trường usersList vào state để lưu danh sách
        })
        .addCase(getUsersThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Lấy danh sách người dùng thất bại';
        }).addCase(updateProfileThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateProfileThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.userInfo = {
            ...state.userInfo,
            ...action.payload, // cập nhật lại thông tin mới
          };
          state.error = null;
        })
        .addCase(updateProfileThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Cập nhật thông tin thất bại';
        })
        .addCase(updatePasswordThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updatePasswordThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
        })
        .addCase(updatePasswordThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Đổi mật khẩu thất bại';
        });
    },
  });

  export const { logout } = userSlice.actions;

  export default userSlice.reducer;
