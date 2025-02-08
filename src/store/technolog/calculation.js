import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

export const getCalculateList = createAsyncThunk(
    'calculationSlice/getCalculateList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`calculation/crud/1/`);
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
                consumption: ''
            }
        ],
        prices: [
            {
                title: '',
                price: ''
            }
        ]
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
            console.log(action.payload)
            state.operations[action.payload.key][action.payload.name] = action.payload.value;
        },
        deleteOperation: (state, action) => {
            state.operations.splice(action.payload, 1);
        },

        addConsumable: (state) => {
            state.consumables.push({
                nomenclature: '',
                title: '',
                consumption: ''
            })
        },
        getValueConsumable: (state, action) => {
            state.consumables[action.payload.key][action.payload.name] = action.payload.value;
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCalculateList.pending, (state) => {
                state.client_list_status = 'loading';
            }).addCase(getCalculateList.fulfilled, (state, action) => {
                state.client_list_status = 'success';
                state.client_list = action.payload
            }).addCase(getCalculateList.rejected, (state) => {
                state.client_list_status = 'error';
            })
    }
})

export const { addOperation, addConsumable, 
               addPrice, getValueOperation, 
               deleteOperation, getValueConsumable, 
               deleteConsumable } = CalculationSlice.actions;
export default CalculationSlice;