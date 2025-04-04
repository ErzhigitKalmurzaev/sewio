import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

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

export const getEquipmentById = createAsyncThunk(
    'equipment/getEquipmentById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`equipment/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getEquipmentServices = createAsyncThunk(
    'equipment/getEquipmentServices',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`equipment/services/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postEquipmentService = createAsyncThunk(
    'equipment/postEquipmentService',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post(`equipment/services/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postEquipment = createAsyncThunk(
    'equipment/postEquipment',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post('equipment/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postEquipmentFiles = createAsyncThunk(
    'equipment/postEquipmentFiles',
    async (props, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            
            for (const key in props) {
                if (key === "images" || key === 'delete_ids') {
                    for (let i = 0; i < props[key].length; i++) {
                        const item = props[key][i]
                        formData.append(key, item)
                    }
                } else {
                    formData.append(key, props[key])
                }
            }
            
            const { data } =  await ImageUploadingFetch.post('equipment/images/', formData);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const patchEquipment = createAsyncThunk(
    'equipment/patchEquipment',
    async ({ props, id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.patch(`equipment/crud/${id}/`, props);
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
        equipment_list_status: 'loading',
        equipment_info: null,
        equipment_info_status: 'loading',
        equipment_services: null,
        equipment_services_status: 'loading'
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
            // -----------------------------------------------
            .addCase(getEquipmentById.pending, (state) => {
                state.equipment_info_status = 'loading';
            }).addCase(getEquipmentById.fulfilled, (state, action) => {
                state.equipment_info_status = 'success';
                state.equipment_info = action.payload
            }).addCase(getEquipmentById.rejected, (state) => {
                state.equipment_info_status = 'error';
            })
            // -----------------------------------------------
            .addCase(getEquipmentServices.pending, (state) => {
                state.equipment_services_status = 'loading';
            }).addCase(getEquipmentServices.fulfilled, (state, action) => {
                state.equipment_services_status = 'success';
                state.equipment_services = action.payload
            }).addCase(getEquipmentServices.rejected, (state) => {
                state.equipment_services_status = 'error';
            })
    }
})

export const EquipmentActions = EquipmentSlice.actions;
export default EquipmentSlice;