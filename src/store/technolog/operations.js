import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getOperationList = createAsyncThunk(
    'operation/getOperationList',
    async ({ search, is_active }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`sample/operations/list/?title=${search}&page_size=${1000}&is_active=${is_active}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getFolderList = createAsyncThunk(
    'operation/getFolderList',
    async ({ search }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`sample/combination-files/crud/?title=${search}&page_size=${1000}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createFolder = createAsyncThunk(
    'operation/createFolder',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post(`sample/combination-files/crud/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getCombinationList = createAsyncThunk(
    'operation/getCombinationList',
    async ({ search }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`sample/combinations/list/?title=${search}&page_size=${1000}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getFolderById = createAsyncThunk(
    'operation/getFolderById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`sample/combination-files/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editFolderById = createAsyncThunk(
    'operation/editFolderById',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.patch(`sample/combination-files/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const deleteFolderById = createAsyncThunk(
    'operation/deleteFolderById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.delete(`sample/combination-files/crud/${id}/`);
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

export const getOperationById = createAsyncThunk(
    'operation/getOperationById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`sample/operations/list/${id}/`);
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
        folder: null,
        folder_status: 'loading',
        combination: null,
        combination_status: '',
        operation: null,
        operation_status: 'loading'
    },
    reducers: {
        changeFolderValue: (state, action) => {
            state.folder[action.payload.name] = action.payload.value
        },
        changeCombinationValue: (state, action) => {
            state.combination[action.payload.name] = action.payload.value
        },
        changeOperationValue: (state, action) => {
            state.operation[action.payload.name] = action.payload.value
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
            //---------------------------------------------------------
            .addCase(getOperationList.pending, (state) => {
                state.operaitions_list_status = 'loading';
            }).addCase(getOperationList.fulfilled, (state, action) => {
                state.operaitions_list_status = 'success';
                state.operaitions_list = action.payload
            }).addCase(getOperationList.rejected, (state) => {
                state.operaitions_list_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getOperationById.pending, (state) => {
                state.operation_status = 'loading';
            }).addCase(getOperationById.fulfilled, (state, action) => {
                state.operation_status = 'success';
                state.operation = action.payload
            }).addCase(getOperationById.rejected, (state) => {
                state.operation_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getFolderById.pending, (state) => {
                state.folder_status = 'loading';
            }).addCase(getFolderById.fulfilled, (state, action) => {
                state.folder_status = 'success';
                state.folder = action.payload
            }).addCase(getFolderById.rejected, (state) => {
                state.folder_status = 'error';
            })
    }
})

export const { changeCombinationValue, changeOperationValue, changeFolderValue } = OperationSlice.actions;
export default OperationSlice;