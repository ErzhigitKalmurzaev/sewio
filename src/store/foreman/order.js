import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const getPartyList = createAsyncThunk(
    'foreman/getPartyList',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('work/get-party-info/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getStaffList = createAsyncThunk(
    'foreman/getStaffList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('user/staff/list/');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getProductOperations = createAsyncThunk(
    'foreman/getProductOperations',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('work/get-product-operations/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postAcceptOperation = createAsyncThunk(
    'foreman/postAcceptOperation',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('work/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const ForemanOrderSlice = createSlice({
  name: 'foreman',
  initialState: {
    party_list: null,
    party_list_status: 'loading',
    staff_list: null,
    staff_list_status: 'loading',
    operations_list: [
        {
            id: '',
            title: '',
            details: [
                {
                    staff: '',
                    count: '',
                }
            ]
        }
    ],
    operations_list_status: 'loading',
    parties: null,
  },
  reducers: {
    addDetail: (state, action) => {
        const { operationId } = action.payload;
        const operation = state.operations_list.find((op) => op.id === operationId);
        if (operation) {
          operation.details.push({ staff: "", count: "" });
        }
    },
    removeDetail: (state, action) => {
        const { operationId, index } = action.payload;
        const operation = state.operations_list.find((op) => op.id === operationId);
        if (operation) {
          operation.details.splice(index, 1);
        }
      },
    updateDetail: (state, action) => {
        const { operationId, index, field, value } = action.payload;
        const operation = state.operations_list.find((op) => op.id === operationId);
        if (operation) {
          operation.details[index][field] = value;
        }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(getPartyList.pending, (state) => {
            state.party_list_status = 'loading';
        }).addCase(getPartyList.fulfilled, (state, action) => {
            state.party_list = action.payload;
            state.parties = action.payload?.map((item, index) => ({ title: item.number, value: index }));
            state.party_list_status = 'success';
        }).addCase(getPartyList.rejected, (state) => {
            state.party_list_status = 'error';
        })
        //---------------------------------------------------------
        .addCase(getProductOperations.pending, (state) => {
            state.operations_list_status = 'loading';
        }).addCase(getProductOperations.fulfilled, (state, action) => {
            state.operations_list = action.payload.map(item => ({
                id: item.id,
                title: item.title,
                details: [
                    {
                        staff: '',
                        count: '',
                    }
                ]
            }))
            state.operations_list_status = 'success';
        }).addCase(getProductOperations.rejected, (state) => {
            state.operations_list_status = 'error';
        })
        //---------------------------------------------------------
        .addCase(getStaffList.pending, (state) => {
            state.staff_list_status = 'loading';
        }).addCase(getStaffList.fulfilled, (state, action) => {
            state.staff_list = action.payload;
            state.staff_list_status = 'success';
        }).addCase(getStaffList.rejected, (state) => {
            state.staff_list_status = 'error';
        })
    }
});

export const { addDetail, removeDetail, updateDetail } = ForemanOrderSlice.actions;
export default ForemanOrderSlice;
