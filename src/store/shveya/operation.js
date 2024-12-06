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

const ShveyaOperationSlice = createSlice({
    name: 'operation',
    initialState: {
        operations_list: null,
        operations_list_status: 'loading'
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
    }
})

export const ShveyaOperationActions = ShveyaOperationSlice.actions;
export default ShveyaOperationSlice;