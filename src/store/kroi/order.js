import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getOrdersList = createAsyncThunk(
    'operation/getOrdersList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`work/order-info/list/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const KroiOrderSlice = createSlice({
    name: 'order',
    initialState: {
        orders_list: null,
        orders_list_status: 'loading',
        party_amounts: []
    },
    reducers: {
        fillPartyAmounts: (state, action) => {
            state.party_amounts = action.payload
        },
        getValueAmount: (state, action) => {
            const { index, value, sIndex } = action.payload;

            state.party_amounts[index].sizes[sIndex].true_amount = value;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrdersList.pending, (state) => {
                state.orders_list_status = 'loading';
            }).addCase(getOrdersList.fulfilled, (state, action) => {
                state.orders_list_status = 'success';
                state.orders_list = action.payload
            }).addCase(getOrdersList.rejected, (state) => {
                state.orders_list_status = 'error';
            })
            //---------------------------------------------------------
    }
})

export const { fillPartyAmounts, getValueAmount } = KroiOrderSlice.actions;
export default KroiOrderSlice;