import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const logIn = createAsyncThunk(
    'technologProduct/logIn',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('token/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getProfile = createAsyncThunk(
    'technologProduct/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('staff/me-info/');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: 'loading',
    me_info: {},
    me_info_status: 'loading'
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('sewio_token');
    },
    checkAuth: (state) => {
      const user = localStorage.getItem('sewio_token');
      if (user) {
        // state.user = JSON.parse(user);
        state.isAuthenticated = 'success';
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(logIn.pending, (state) => {
            state.isAuthenticated = 'loading';
        }).addCase(logIn.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = 'success';
            localStorage.setItem('sewio_token', action.payload?.access_token);
        }).addCase(logIn.rejected, (state) => {
            state.isAuthenticated = 'error';
        })

        .addCase(getProfile.pending, (state) => {
            state.me_info_status = 'loading';
        }).addCase(getProfile.fulfilled, (state, action) => {
            state.me_info = action.payload;
            state.me_info_status = 'success';
        }).addCase(getProfile.rejected, (state) => {
            state.me_info_status = 'error';
        })
    }
});

export const { login, logout, checkAuth } = AuthSlice.actions;
export default AuthSlice;
