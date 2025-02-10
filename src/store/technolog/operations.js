import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getOperationList = createAsyncThunk(
    'operation/getOperationList',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`work/order-operations/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getFolderList = createAsyncThunk(
    'operation/getFolderList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`sample/combination-files/crud/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getCombinationList = createAsyncThunk(
    'operation/getCombinationList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`sample/combinations/list/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getCombinationById = createAsyncThunk(
    'operation/getCombinationById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`sample/combinations/list/${id}/`);
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
        folders_list: null,
        folders_list_status: 'loading',
        combinations_list: null,
        combinations_list_status: 'loading',
        combination: null,
        combination_status: 'loading'
    },
    reducers: {
        changeCombinationValue: (state, action) => {
            state.combination[action.payload.name] = action.payload.value
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFolderList.pending, (state) => {
                state.folders_list_status = 'loading';
            }).addCase(getFolderList.fulfilled, (state, action) => {
                state.folders_list_status = 'success';
                state.folders_list = action.payload
            }).addCase(getFolderList.rejected, (state) => {
                state.folders_list_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getCombinationList.pending, (state) => {
                state.combinations_list_status = 'loading';
            }).addCase(getCombinationList.fulfilled, (state, action) => {
                state.combinations_list_status = 'success';
                state.combinations_list = action.payload
            }).addCase(getCombinationList.rejected, (state) => {
                state.combinations_list_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getCombinationById.pending, (state) => {
                state.combination_status = 'loading';
            }).addCase(getCombinationById.fulfilled, (state, action) => {
                state.combination_status = 'success';
                state.combination = action.payload
            }).addCase(getCombinationById.rejected, (state) => {
                state.combination_status = 'error';
            })
    }
})

export const { changeCombinationValue } = OperationSlice.actions;
export default OperationSlice;