import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getProductList = createAsyncThunk(
    'technologProduct/getProductList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('products');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createProduct = createAsyncThunk(
    'technologProduct/createProduct',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('product/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getProductById = createAsyncThunk(
    'technologProduct/getProductById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`product/crud/${id}/`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const TechnologProductSlice = createSlice({
    name: 'technologProduct',
    initialState: {
        products_list: [],
        products_list_status: 'loading',
        product: {},
        product_status: 'loading'
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
            // ------------------------------------------
            .addCase(getProductById.pending, (state) => {
                state.product_status = 'loading';
            }).addCase(getProductById.fulfilled, (state, action) => {
                state.product_status = 'success';
                state.product = action.payload
            }).addCase(getProductById.rejected, (state) => {
                state.product_status = 'error';
            })
            // ------------------------------------------
    }
})

export const TechnologProductActions = TechnologProductSlice.actions;
export default TechnologProductSlice;