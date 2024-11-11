import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getSizeCategoryList = createAsyncThunk(
    'size/getSizeList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get('general/size/categories/');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createSizeCategory = createAsyncThunk(
    'size/createSizeCategory',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('general/size/category/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editSizeCategory = createAsyncThunk(
    'size/editSizeCategory',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`general/size/category/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createSize = createAsyncThunk(
    'size/createSize',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('general/size/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editingSizeCategory = createAsyncThunk(
    'size/editingSizeCategory',
    async ({id, props}, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`general/rank/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const TechnologSizeSlice = createSlice({
    name: 'size',
    initialState: {
        size_category_list: [],
        size_category_list_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getSizeCategoryList.pending, (state) => {
                state.size_category_list_status = 'loading';
            }).addCase(getSizeCategoryList.fulfilled, (state, action) => {
                state.size_category_list_status = 'success';
                state.size_category_list = action.payload
            }).addCase(getSizeCategoryList.rejected, (state) => {
                state.size_category_list_status = 'error';
            })
    }
})

export const TechnologSizeActions = TechnologSizeSlice.actions;
export default TechnologSizeSlice;