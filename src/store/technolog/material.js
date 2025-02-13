import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getConsumablesTitleList = createAsyncThunk(
    'material/getConsumablesTitleList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`calculation/consumables/titles/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getMateralList = createAsyncThunk(
    'material/getMateralList',
    async ({ title }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`material/list/?title=${title}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getMaterial = createAsyncThunk(
    'material/getMaterial',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`calculation/consumables/detail/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postMaterial = createAsyncThunk(
    'material/postMaterial',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post(`warehouse/material/crud/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const patchMaterial = createAsyncThunk(
    'material/patchMaterial',
    async ({ props, id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.patch(`warehouse/material/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const fillWarehouseWithMaterial = createAsyncThunk(
    'material/fillWarehouseWithMaterial',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post(`warehouse/input/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createRank = createAsyncThunk(
    'material/createRank',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('general/rank/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editingRank = createAsyncThunk(
    'material/editingRank',
    async ({id, props}, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`general/rank/crud/${id}/`, props);
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

const MaterialSlice = createSlice({
    name: 'material',
    initialState: {
        materials_list: null,
        materials_list_status: 'loading',
        consumables_title_list: null,
        consumables_title_list_status: 'loading',
        colors_list: null
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getMateralList.pending, (state) => {
                state.materials_list_status = 'loading';
            }).addCase(getMateralList.fulfilled, (state, action) => {
                state.materials_list_status = 'success';
                state.materials_list = action.payload
            }).addCase(getMateralList.rejected, (state) => {
                state.materials_list_status = 'error';
            })
            .addCase(getConsumablesTitleList.pending, (state) => {
                state.consumables_title_list_status = 'loading';
            }).addCase(getConsumablesTitleList.fulfilled, (state, action) => {
                state.consumables_title_list_status = 'success';
                state.consumables_title_list = action.payload
            }).addCase(getConsumablesTitleList.rejected, (state) => {
                state.consumables_title_list_status = 'error';
            })
            .addCase(getColors.fulfilled, (state, action) => {
                state.colors_list = action.payload;
            })

    }
})

export const MaterialSliceActions = MaterialSlice.actions;
export default MaterialSlice;