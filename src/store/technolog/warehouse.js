import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

export const getWarehouseList = createAsyncThunk(
    'warehouse/getWarehouseList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`warehouse/crud/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getWarehouseById = createAsyncThunk(
    'warehouse/getWarehouseById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`warehouse/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postWarehouse = createAsyncThunk(
    'warehouse/postWarehouse',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('warehouse/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const patchWarehouse = createAsyncThunk(
    'warehouse/patchWarehouse',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`warehouse/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const WarehouseSlice = createSlice({
    name: 'warehouse',
    initialState: {
        warehouse_list: [],
        warehouse_list_status: 'loading',
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getWarehouseList.pending, (state) => {
                state.warehouse_list_status = 'loading';
            }).addCase(getWarehouseList.fulfilled, (state, action) => {
                state.warehouse_list_status = 'success';
                state.warehouse_list = action.payload
            }).addCase(getWarehouseList.rejected, (state) => {
                state.warehouse_list_status = 'error';
            })
    }
})

export const WarehouseActions = WarehouseSlice.actions;
export default WarehouseSlice;