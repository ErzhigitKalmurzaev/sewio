import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

export const getCalculateList = createAsyncThunk(
    'calculationSlice/getCalculateList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`calculation/list/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getOperationsTitlesList = createAsyncThunk(
    'calculationSlice/getOperationsTitlesList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`calculation/operations/titles/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getOperation = createAsyncThunk(
    'calculationSlice/getOperation',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`calculation/operations/detail/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getClientsNames = createAsyncThunk(
    'calculationSlice/getClientsNames',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`calculation/clients/names/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createCalculation = createAsyncThunk(
    'calculationSlice/createCalculation',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`calculation/crud/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const CalculationSlice = createSlice({
    name: 'calculationSlice',
    initialState: {
        mainFields: {
            vendor_code: "",
            title: "",
            count: '',
            is_active: true,
            price: '',
            cost_price: '',
        },
        operations: [
            {
                title: '',
                time: '',
                rank: '',
                price: ''
            }
        ],
        consumables: [
            {
                nomenclature: '',
                title: '',
                consumption: '',
                unit: '',
                price: ''
            }
        ],
        prices: [
            {
                title: '',
                price: ''
            }
        ],

        operations_list: null,
        clients: null,
        calc_history: null,
        calc_history_status: 'loading'
    },
    reducers: {
        addOperation: (state) => {
            state.operations.push({
                title: '',
                time: '',
                rank: '',
                price: ''
            })
        },
        getValueOperation: (state, action) => {
            if(action.payload.name === 'rank') {
                const rank_kef = action.payload.rank_list.find(item => item.id === action.payload.value)?.percent;
                state.operations[action.payload.key][action.payload.name] = action.payload.value;
                state.operations[action.payload.key]['price'] = rank_kef * state.operations[action.payload.key]['time'] || '';
            } else if(action.payload.name === 'time') {
                const rank_kef = action.payload.rank_list.find(item => item.id === state.operations[action.payload.key]['rank'])?.percent;
                state.operations[action.payload.key][action.payload.name] = action.payload.value;
                state.operations[action.payload.key]['price'] = action.payload.value * rank_kef || '';
            }
             else {
                state.operations[action.payload.key][action.payload.name] = action.payload.value;
            }
        },
        fillOperation: (state, action) => {
            state.operations[action.payload.key] = action.payload.value;    
        },
        deleteOperation: (state, action) => {
            state.operations.splice(action.payload, 1);
        },

        addConsumable: (state) => {
            state.consumables.push({
                nomenclature: '',
                title: '',
                consumption: '',
                unit: '',
                price: ''
            })
        },
        getValueConsumable: (state, action) => {
            state.consumables[action.payload.key][action.payload.name] = action.payload.value;
        },
        fillConsumable: (state, action) => {
            state.consumables[action.payload.key] = action.payload.value;
        },
        deleteConsumable: (state, action) => {
            state.consumables.splice(action.payload, 1);
        },

        addPrice: (state) => {
            state.prices.push({
                title: '',
                price: ''
            })
        },
        getValuePrice: (state, action) => {
            state.prices[action.payload.key][action.payload.name] = action.payload.value;
        },
        deletePrice: (state, action) => {
            state.prices.splice(action.payload, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCalculateList.pending, (state) => {
                state.calc_history_status = 'loading';
            }).addCase(getCalculateList.fulfilled, (state, action) => {
                state.calc_history_status = 'success';
                state.calc_history = action.payload
            }).addCase(getCalculateList.rejected, (state) => {
                state.calc_history_status = 'error';
            })
            .addCase(getOperationsTitlesList.fulfilled, (state, action) => {
                state.operations_list = action.payload
            })
            .addCase(getClientsNames.fulfilled, (state, action) => {
                state.clients = action.payload
            })
    }
})

export const { addOperation, addConsumable, 
               addPrice, getValueOperation, 
               deleteOperation, getValueConsumable, 
               deleteConsumable, fillConsumable,
               fillOperation, getValuePrice, deletePrice } = CalculationSlice.actions;
export default CalculationSlice;