import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getEquipmentList = createAsyncThunk(
    'equipment/getEquipmentList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get('equipment/crud/');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createRank = createAsyncThunk(
    'equipment/createRank',
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
    'equipment/editingRank',
    async ({id, props}, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`general/rank/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const EquipmentSlice = createSlice({
    name: 'equipment',
    initialState: {
        equipment_list: null,
        equipment_list_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getEquipmentList.pending, (state) => {
                state.equipment_list_status = 'loading';
            }).addCase(getEquipmentList.fulfilled, (state, action) => {
                state.equipment_list_status = 'success';
                state.equipment_list = action.payload
            }).addCase(getEquipmentList.rejected, (state) => {
                state.equipment_list_status = 'error';
            })
    }
})

export const EquipmentActions = EquipmentSlice.actions;
export default EquipmentSlice;