import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getMyOperationList = createAsyncThunk(
    'operation/getMyOperationList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`work/history/list/my/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postInputWork = createAsyncThunk(
    'operation/postInputWork',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post(`work/input/my/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getMyOrdersList = createAsyncThunk(
    'operation/getMyOrdersList',
    async ({ urls }, { rejectWithValue }) => {
        try {
            const { page, page_size } = urls;

            const { data } =  await axiosInstance.get(`client/order/list/?page=${page}&page_size=${page_size}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getMyOrderById = createAsyncThunk(
    'operation/getMyOrderById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`client/order/list/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const ShveyaOperationSlice = createSlice({
    name: 'operation',
    initialState: {
        operations_list: null,
        operations_list_status: 'loading',
        my_orders_list: null,
        my_orders_list_status: 'loading',
        my_order: null,
        my_order_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyOperationList.pending, (state) => {
                state.operations_list_status = 'loading';
            }).addCase(getMyOperationList.fulfilled, (state, action) => {
                state.operations_list_status = 'success';
                state.operations_list = action.payload
            }).addCase(getMyOperationList.rejected, (state) => {
                state.operations_list_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getMyOrdersList.pending, (state) => {
                state.my_orders_list_status = 'loading';
            }).addCase(getMyOrdersList.fulfilled, (state, action) => {
                state.my_orders_list_status = 'success';
                state.my_orders_list = action.payload
            }).addCase(getMyOrdersList.rejected, (state) => {
                state.my_orders_list_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getMyOrderById.pending, (state) => {
                state.my_order_status = 'loading';
                state.my_order = null
            }).addCase(getMyOrderById.fulfilled, (state, action) => {
                state.my_order_status = 'success';
                state.my_order = action.payload
            }).addCase(getMyOrderById.rejected, (state) => {
                state.my_order_status = 'error';
            })
    }
})

export const ShveyaOperationActions = ShveyaOperationSlice.actions;
export default ShveyaOperationSlice;