import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getOperationList = createAsyncThunk(
    'material/getOperationList',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`work/order-operations/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getStaffsList = createAsyncThunk(
    'material/getStaffsList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`work/staffs/list/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postDistOperation = createAsyncThunk(
    'material/postDistOperation',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post(`work/output/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const OperationSlice = createSlice({
    name: 'operation',
    initialState: {
        operations_list: null,
        operaitions_list_status: 'loading',
        staffs_list: null,
        staffs_list_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getOperationList.pending, (state) => {
                state.operaitions_list_status = 'loading';
            }).addCase(getOperationList.fulfilled, (state, action) => {
                state.operaitions_list_status = 'success';
                state.operations_list = action.payload
            }).addCase(getOperationList.rejected, (state) => {
                state.operaitions_list_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getStaffsList.pending, (state) => {
                state.staffs_list_status = 'loading';
            }).addCase(getStaffsList.fulfilled, (state, action) => {
                state.staffs_list_status = 'success';
                state.staffs_list = action.payload
            }).addCase(getStaffsList.rejected, (state) => {
                state.staffs_list_status = 'error';
            })
            //---------------------------------------------------------
    }
})

export const OperationSliceActions = OperationSlice.actions;
export default OperationSlice;