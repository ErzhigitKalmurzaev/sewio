import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

export const getProductList = createAsyncThunk(
    'technologProduct/getProductList',
    async ({ urls}, { rejectWithValue }) => {
        try {
            const { is_active, page, page_size, title } = urls;
            const { data } = await axiosInstance.get(`product/list/?is_active=${is_active}&page=${page}&page_size=${page_size}&title=${title}`);
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

export const editProductById = createAsyncThunk(
    'technologProduct/editProductById',
    async ({ id, props}, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`product/crud/${id}/`, props);
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
            const res = await axiosInstance.get(`product/detail/${id}/`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createOperation = createAsyncThunk(
    'technologProduct/createOperation',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('product/operation/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editOperationById = createAsyncThunk(
    'technologProduct/editOperationById',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`product/operation/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const deactivateOperationById = createAsyncThunk(
    'technologProduct/deactivateOperationById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`product/operation/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createCombination = createAsyncThunk(
    'technologProduct/createCombination',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('product/combination/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editCombinationById = createAsyncThunk(
    'technologProduct/editCombinationById',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`product/combination/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const deleteCombinationById = createAsyncThunk(
    'technologProduct/deleteCombinationById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`product/combination/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getProductImages = createAsyncThunk(
    'technologProduct/getProductImages',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`product/${id}/images/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createProductImages = createAsyncThunk(
    'technologProduct/createProductImages',
    async ({ props }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            for (const key in props) {
                if (key === "images" || key === 'delete_ids') {
                    for (let i = 0; i < props[key].length; i++) {
                        const item = props[key][i]
                        formData.append(key, item)
                    }
                } else {
                    formData.append(key, props[key])
                }
            }
            console.log(formData)
            const { data } = await ImageUploadingFetch.post(`product/images/crud`, formData);
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
        products_list_status: 'loading',
        product: {},
        product_status: 'loading',
        product_images: [],
        product_images_status: 'loading',
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
            .addCase(getProductImages.pending, (state) => {
                state.product_images_status = 'loading';
            }).addCase(getProductImages.fulfilled, (state, action) => {
                state.product_images_status = 'success';
                state.product_images = action.payload
            }).addCase(getProductImages.rejected, (state) => {
                state.product_images_status = 'error';
            })
            // ------------------------------------------
    }
})

export const TechnologProductActions = TechnologProductSlice.actions;
export default TechnologProductSlice;