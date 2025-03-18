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

export const patchAcceptOperation = createAsyncThunk(
    'foreman/patchAcceptOperation',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`work/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getWorksHistory = createAsyncThunk(
    'foreman/postAcceptOperation',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`work/get-works/?product=${props.product}&order=${props.order}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getWorkById = createAsyncThunk(
    'foreman/getWorkById',
    async ({ work, product }, { rejectWithValue }) => {
        try {
            const works = await axiosInstance.get(`work/get-works/${work}/`);
            const operations = await axiosInstance.post('work/get-product-operations/', product);
            return { work: works.data, operations: operations.data };
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const deleteWorkById = createAsyncThunk(
    'foreman/deleteWorkById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const data = await axiosInstance.delete(`work/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

function groupOperations(data = [], allOperations = []) {
    const grouped = {};

    if (!Array.isArray(data)) {
        return [];
    }

    data.forEach(({ staff, operation, amount }) => {
        if (!operation || !staff) return;
        
        if (!grouped[operation.id]) {
            grouped[operation.id] = {
                id: operation.id,
                title: operation.title,
                details: []
            };
        }

        grouped[operation.id].details.push({
            staff: `${staff.id}`,
            count: amount
        });
    });

    if (Array.isArray(allOperations)) {
        allOperations.forEach(op => {
            if (!grouped[op.id]) {
                grouped[op.id] = {
                    id: op.id,
                    title: op.title,
                    details: [
                        {
                            staff: '',
                            count: ''
                        }
                    ]
                };
            }
        });
    }

    return Object.values(grouped);
}

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
    works_history: null,
    works_history_status: 'loading',
    work: null,
    work_status: 'loading'
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
    clearOperationsList: (state) => {
        state.operations_list = [{
            id: '',
            title: '',
            details: [
                {
                    staff: '',
                    count: '',
                }
            ]
        }];
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(getPartyList.pending, (state) => {
            state.party_list_status = 'loading';
        }).addCase(getPartyList.fulfilled, (state, action) => {
            state.party_list = action.payload;
            state.parties = action.payload?.map((item, index) => ({ title: item.number, value: index, id: item.id }));
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
        //---------------------------------------------------------
        .addCase(getWorksHistory.pending, (state) => {
            state.works_history_status = 'loading';
        }).addCase(getWorksHistory.fulfilled, (state, action) => {
            state.works_history = action.payload;
            state.works_history_status = 'success';
        }).addCase(getWorksHistory.rejected, (state) => {
            state.works_history_status = 'error';
        })
        //---------------------------------------------------------
        .addCase(getWorkById.pending, (state) => {
            state.work_status = 'loading';
        }).addCase(getWorkById.fulfilled, (state, action) => {
            state.work = action.payload.work;
            state.operations_list = groupOperations(action.payload?.work?.details || [], action.payload?.operations || []) || [];
            state.work_status = 'success';
        }).addCase(getWorkById.rejected, (state) => {
            state.work_status = 'error';
        })

    }
});

export const { addDetail, removeDetail, updateDetail, clearOperationsList } = ForemanOrderSlice.actions;
export default ForemanOrderSlice;
