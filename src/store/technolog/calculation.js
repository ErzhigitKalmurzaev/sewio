import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";
import { act } from "react";

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

export const getCalculateById = createAsyncThunk(
    'calculationSlice/getCalculateById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`calculation/crud/${id}/`);
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

export const editCalculationById = createAsyncThunk(
    'calculationSlice/editCalculationById',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`calculation/crud/${id}/`, props);
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
        calc_history_status: 'loading',
        calc_status: 'loading'
    },
    reducers: {
        clearAll: (state) => {
            state.operations = [
                {
                    title: '',
                    time: '',
                    rank: '',
                    price: ''
                }
            ]
            state.combinations = [
    
            ]
            state.consumables = [
                {
                    material_nomenclature: '',
                    title: '',
                    consumption: '',
                    color: ''
                }
            ]
            state.prices = [
                {
                    title: '',
                    price: ''
                }
            ]
        },
        addOperation: (state) => {
            state.operations.push({
                title: '',
                time: '',
                rank: '',
                price: ''
            })
        },
        getValueOperation: (state, action) => {
            state.operations[action.payload.key][action.payload.name] = action.payload.value;
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
            .addCase(getCalculateById.pending, (state) => {
                state.calc_status = 'loading';
                state.operations = [];
                state.consumables = [];
                state.prices = [];
            })
            .addCase(getCalculateById.fulfilled, (state, action) => {
                state.calc_status = 'success';
                const calc = action.payload;
                state.mainFields = {
                    vendor_code: calc.vendor_code,
                    title: calc.title,
                    count: calc.count,
                    is_active: calc.is_active,
                    price: calc.price,
                    cost_price: calc.cost_price
                };
                state.operations = action.payload.cal_operations.map(item => ({
                    title: item.title,
                    time: item.time,
                    rank: item.rank,
                    price: item.price
                }));
                state.consumables = action.payload.cal_consumables.map(item => ({
                    title: item.title,
                    consumption: item.consumption,
                    unit: item.unit,
                    price: item.price,
                    nomenclature: item.nomenclature
                }));
                state.prices = action.payload.cal_prices.map(item => ({
                    title: item.title,
                    price: item.price    
                }));
            })
            .addCase(getCalculateById.rejected, (state) => {
                state.calc_status = 'error';
            })

    }
})

export const { addOperation, addConsumable, 
               addPrice, getValueOperation, 
               deleteOperation, getValueConsumable, 
               deleteConsumable, fillConsumable,
               fillOperation, getValuePrice, deletePrice,
               clearAll } = CalculationSlice.actions;
export default CalculationSlice;