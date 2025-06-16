import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCategory, updateCategory, updateSubCategory } from '../services/categoryApi';
import axiosInstance from '../services/axiosInstance';

// Async thunk tạo danh mục
export const createCategoryThunk = createAsyncThunk(
  'category/create',
  async (data, thunkAPI) => {
    try {
      const response = await createCategory(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Tạo danh mục thất bại');
    }
  }
);
export const getCategories = createAsyncThunk(
  'category/getAll',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/categories');
      return res.data.categories; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Lỗi khi lấy danh sách danh mục');
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/categories/${categoryId}`);
      return { categoryId }; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Xóa danh mục thất bại');
    }
  }
);

export const deleteSubCategoryThunk = createAsyncThunk(
  'category/deleteSubCategory',
  async (subCategoryId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/categories/sub/${subCategoryId}`);
      return { subCategoryId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Xóa danh mục con thất bại');
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  'category/updateCategory',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateCategory(id, data);
      return res.category;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Cập nhật danh mục thất bại');
    }
  }
);

export const updateSubCategoryThunk = createAsyncThunk(
  'category/updateSubCategory',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateSubCategory(id, data);
      return res.subCategory;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Cập nhật danh mục con thất bại');
    }
  }
);
export const getPublicCategories = createAsyncThunk(
  'category/getPublic',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/categories/public');
      return res.data.categories;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Lỗi khi lấy danh mục công khai');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload.category);
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
    .addCase(getCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.list = state.list.filter(cat => cat.id !== action.payload.categoryId);
    })
    .addCase(deleteCategoryThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Xóa sub category
    .addCase(deleteSubCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteSubCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;
      // Tìm category chứa sub category cần xóa
      state.list = state.list.map(cat => ({
        ...cat,
        subCategories: cat.subCategories.filter(sub => sub.id !== action.payload.subCategoryId)
      }));
    })
      .addCase(deleteSubCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cập nhật category
      .addCase(updateCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(cat => cat.id === action.payload.id ? {
          ...cat,
          ...action.payload
        } : cat);
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cập nhật sub category
      .addCase(updateSubCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(cat => {
          if (cat.id === action.payload.categoryId) {
            return {
              ...cat,
              subCategories: cat.subCategories.map(sub =>
                sub.id === action.payload.id ? action.payload : sub
              )
            };
          }
          return cat;
        });
      })
      .addCase(updateSubCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPublicCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(getPublicCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    })
    .addCase(getPublicCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

  }

});


export const { resetCategoryState } = categorySlice.actions;

export default categorySlice.reducer;
