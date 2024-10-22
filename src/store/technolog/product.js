import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getProductList = createAsyncThunk(
    'technologProduct/getProductList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = axiosInstance.get('products');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const TechnologProductSlice = createSlice({
    name: 'technologProduct',
    initialState: {
        products_list: [],
        products_list_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductList.pending, (state) => {
                state.products_list_status = 'loading';
            }).addCase(getProductList.fulfilled, (state, action) => {
                state.products_list_status = 'success';
                state.products_list = action.payload
            }).addCase(getProductList.rejected, (state) => {
                state.products_list_status = 'error';
            })
    }
})

export const TechnologProductActions = TechnologProductSlice.actions;
export default TechnologProductSlice;