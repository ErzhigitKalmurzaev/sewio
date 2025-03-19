import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

export const getWarehouseListWithoutMe = createAsyncThunk(
    'warehouse/getWarehouseList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`warehouse/list/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getComings = createAsyncThunk(
    'warehouse/getComings',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`warehouse/movements/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getComingHistory = createAsyncThunk(
    'warehouse/getComingHistory',
    async ({ page, page_size }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`warehouse/history/list/?page=${page}&page_size=${page_size}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getComingById = createAsyncThunk(
    'warehouse/getComingById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`warehouse/movements/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getComingHistoryById = createAsyncThunk(
    'warehouse/getComingHistoryById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`warehouse/history/list/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postIssueInWarehouse = createAsyncThunk(
    'warehouse/postIssueInWarehouse',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`warehouse/output/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postAnswerComing = createAsyncThunk(
    'warehouse/postAnswerComing',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`warehouse/output/update/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const WareWarehouseSlice = createSlice({
    name: 'warehouse',
    initialState: {
        warehouse_list: [],
        warehouse_list_status: 'loading',
        comings_list: [],
        comings_list_status: 'loading',
        coming: null,
        coming_status: 'loading',
        coming_history: null,
        coming_history_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getWarehouseListWithoutMe.pending, (state) => {
                state.warehouse_list_status = 'loading';
            }).addCase(getWarehouseListWithoutMe.fulfilled, (state, action) => {
                state.warehouse_list_status = 'success';
                state.warehouse_list = action.payload
            }).addCase(getWarehouseListWithoutMe.rejected, (state) => {
                state.warehouse_list_status = 'error';
            })
            // ------------------------------------------
            .addCase(getComings.pending, (state) => {
                state.comings_list_status = 'loading';
            }).addCase(getComings.fulfilled, (state, action) => {
                state.comings_list_status = 'success';
                state.comings_list = action.payload
            }).addCase(getComings.rejected, (state) => {
                state.comings_list_status = 'error';
            })
            // ------------------------------------------
            .addCase(getComingById.pending, (state) => {
                state.coming_status = 'loading';
                state.coming = null;
            }).addCase(getComingById.fulfilled, (state, action) => {
                state.coming_status = 'success';
                state.coming = action.payload
            }).addCase(getComingById.rejected, (state) => {
                state.coming_status = 'error';
            })
            // ------------------------------------------
            .addCase(getComingHistoryById.pending, (state) => {
                state.coming_status = 'loading';
                state.coming = null;
            }).addCase(getComingHistoryById.fulfilled, (state, action) => {
                state.coming_status = 'success';
                state.coming = action.payload
            }).addCase(getComingHistoryById.rejected, (state) => {
                state.coming_status = 'error';
            })
            // ------------------------------------------
            .addCase(getComingHistory.pending, (state) => {
                state.coming_history_status = 'loading';
            }).addCase(getComingHistory.fulfilled, (state, action) => {
                state.coming_history_status = 'success';
                state.coming_history = action.payload
            }).addCase(getComingHistory.rejected, (state) => {
                state.coming_history_status = 'error';
            })
    }
})

export const WareWarehouseActions = WareWarehouseSlice.actions;
export default WareWarehouseSlice;