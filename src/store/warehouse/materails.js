import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

export const getMyMateralsList = createAsyncThunk(
    'material/getMyMateralsList',
    async (props, { rejectWithValue }) => {
        try {
            const { search, is_active, page, page_size, status } = props;

            const { data } =  await axiosInstance.get(`warehouse/my-materials/list/?title=${search}&is_active=${is_active}&page=${page}&page_size=${page_size}&status=${status || ''}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postRejectMaterials = createAsyncThunk(
    'material/postRejectMaterials',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post(`warehouse/defective/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postRejectMaterialsFiles = createAsyncThunk(
    'material/postRejectMaterialsFiles',
    async (props, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            for (const key in props) {
                if (key === "files") {
                    for (let i = 0; i < props[key].length; i++) {
                        const item = props[key][i]
                        formData.append(key, item)
                    }
                } else {
                    formData.append(key, props[key])
                }
            }

            const { data } =  await ImageUploadingFetch.post(`warehouse/defective/files/`, formData);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)
 

const WarehouseMaterialSlice = createSlice({
    name: 'materials',
    initialState: {
        materials_list: null,
        materials_list_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyMateralsList.pending, (state) => {
                state.materials_list_status = 'loading';
            }).addCase(getMyMateralsList.fulfilled, (state, action) => {
                state.materials_list_status = 'success';
                state.materials_list = action.payload
            }).addCase(getMyMateralsList.rejected, (state) => {
                state.materials_list_status = 'error';
            })
    }
})

export const WarehouseMaterialSliceActions = WarehouseMaterialSlice.actions;
export default WarehouseMaterialSlice;