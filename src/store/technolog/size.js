import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getSizesList = createAsyncThunk(
    'size/getSizeList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get('general/sizes/');
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

export const editSize = createAsyncThunk(
    'size/editSize',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`general/size/crud/${props.id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const deleteSize = createAsyncThunk(
    'size/deleteSize',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`general/size/crud/${props}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getColors = createAsyncThunk(
    'material/getColors',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`general/color/crud/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postColor = createAsyncThunk(
    'material/getColors',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`general/color/crud/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const patchColors = createAsyncThunk(
    'material/getColors',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`general/color/crud/${props.id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const TechnologSizeSlice = createSlice({
    name: 'size',
    initialState: {
        sizes_list: null,
        sizes_list_status: 'loading',
        colors_list: null,
        colors_list_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getSizesList.pending, (state) => {
                state.sizes_list_status = 'loading';
            }).addCase(getSizesList.fulfilled, (state, action) => {
                state.sizes_list_status = 'success';
                state.sizes_list = action.payload
            }).addCase(getSizesList.rejected, (state) => {
                state.sizes_list_status = 'error';
            })
            //////////////////////////////////////////////////
            .addCase(getColors.pending, (state) => {
                state.colors_list_status = 'loading';
            }).addCase(getColors.fulfilled, (state, action) => {
                state.colors_list_status = 'success';
                state.colors_list = action.payload
            }).addCase(getColors.rejected, (state) => {
                state.colors_list_status = 'error';
            })
    }
})

export const TechnologSizeActions = TechnologSizeSlice.actions;
export default TechnologSizeSlice;