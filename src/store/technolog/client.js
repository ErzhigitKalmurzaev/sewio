import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

export const getClientList = createAsyncThunk(
    'technologClient/getClientList',
    async ({ search }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`user/client/crud/?name=${search}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createClient = createAsyncThunk(
    'technologClient/createClient',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await ImageUploadingFetch.post('user/client/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createClientFiles = createAsyncThunk(
    'technologClient/createClientFiles',
    async (props, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            for (const key in props) {
                if (key === "files" || key === 'delete_ids') {
                    for (let i = 0; i < props[key].length; i++) {
                        const item = props[key][i]
                        formData.append(key, item)
                    }
                } else {
                    formData.append(key, props[key])
                }
            }

            const { data } = await ImageUploadingFetch.post('user/client/files/', formData);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getClientInfo = createAsyncThunk(
    'technologClient/getClientInfo',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`user/client/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editClientInfo = createAsyncThunk(
    'technologClient/editClientInfo',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } = await ImageUploadingFetch.patch(`user/client/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const TechnologClientSlice = createSlice({
    name: 'technologClient',
    initialState: {
        client_list: [],
        client_list_status: 'loading',
        client_info: {},
        client_info_status: ''
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getClientList.pending, (state) => {
                state.client_list_status = 'loading';
            }).addCase(getClientList.fulfilled, (state, action) => {
                state.client_list_status = 'success';
                state.client_list = action.payload
            }).addCase(getClientList.rejected, (state) => {
                state.client_list_status = 'error';
            })
            .addCase(getClientInfo.pending, (state) => {
                state.client_info_status = 'loading';
            }).addCase(getClientInfo.fulfilled, (state, action) => {
                state.client_info_status = 'success';
                state.client_info = action.payload
            }).addCase(getClientInfo.rejected, (state) => {
                state.client_info_status = 'error';
            })
    }
})

export const TechnologClientActions = TechnologClientSlice.actions;
export default TechnologClientSlice;