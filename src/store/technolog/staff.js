import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

export const getStaffList = createAsyncThunk(
    'technologStaff/getStaffList',
    async ({ urls }, { rejectWithValue }) => {
        try {
            const { search, role, is_active } = urls;
            const { data } = await axiosInstance.get(`user/staff/crud/?name=${search}&role=${role}&is_active=${is_active}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createEmployee = createAsyncThunk(
    'technologStaff/createEmployee',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await ImageUploadingFetch.post('user/staff/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getEmployeeInfo = createAsyncThunk(
    'technologStaff/getEmployeeInfo',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`user/staff/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editEmployeeInfo = createAsyncThunk(
    'technologStaff/editEmployeeInfo',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } = await ImageUploadingFetch.patch(`user/staff/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const TechnologStaffSlice = createSlice({
    name: 'technologStaff',
    initialState: {
        staff_list: [],
        staff_list_status: 'loading',
        staff_info: {},
        staff_info_status: ''
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStaffList.pending, (state) => {
                state.staff_list_status = 'loading';
            }).addCase(getStaffList.fulfilled, (state, action) => {
                state.staff_list_status = 'success';
                state.staff_list = action.payload
            }).addCase(getStaffList.rejected, (state) => {
                state.staff_list_status = 'error';
            })
            .addCase(getEmployeeInfo.pending, (state) => {
                state.staff_info_status = 'loading';
            }).addCase(getEmployeeInfo.fulfilled, (state, action) => {
                state.staff_info_status = 'success';
                state.staff_info = action.payload
            }).addCase(getEmployeeInfo.rejected, (state) => {
                state.staff_info_status = 'error';
            })
    }
})

export const {  } = TechnologStaffSlice.actions;
export default TechnologStaffSlice;