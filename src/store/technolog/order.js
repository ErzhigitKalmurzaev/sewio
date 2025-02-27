import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getOrderClientList = createAsyncThunk(
    'order/getOrderClientList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get('order/clients/list/');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getModerationList = createAsyncThunk(
    'order/getModerationList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get('work/moderation/list/');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const acceptOperation = createAsyncThunk(
    'order/acceptOperation',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post('work/moderation/update/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getOrderProductList = createAsyncThunk(
    'order/getOrderProductList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get('order/products/list/');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getOrderList = createAsyncThunk(
    'order/getOrderList',
    async ({ urls }, { rejectWithValue }) => {
        try {
            const { page, page_size, status, search } = urls;
            const { data } =  await axiosInstance.get(`order/list/?name=${search}&page=${page}&page_size=${page_size}&status=${status}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getOrderById = createAsyncThunk(
    'order/getOrderById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`order/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editOrderById = createAsyncThunk(
    'order/editOrderById',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.patch(`order/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post('order/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const TechnologOrderSlice = createSlice({
    name: 'order',
    initialState: {
        client_list: null,
        client_list_status: 'loading',
        product_list: null,
        product_list_status: 'loading',
        order_list: null,
        order_list_status: 'loading',
        moderation_list: null,
        moderation_list_status: 'loading',
        accept_operation_status: 'loading',

        products_to_order: [
            {
                nomenclature: '',
                price: '',
                cost_price: '',
                amounts: [
                    {
                        color: '',
                        sizes: []
                    }
                ]
            }
        ]
    },
    reducers: {
        addProduct: (state) => {
            state.products_to_order.push({
                nomenclature: '',
                price: '',
                cost_price: '',
                amounts: [
                    {
                        color: '',
                        sizes: []
                    }
                ]
            })
        },
        deleteProduct: (state, action) => {
            const { index } = action.payload;
            state.products_to_order.splice(index, 1);
        },
        change_prod_main: (state, action) => {
            const { index, name, value } = action.payload;

            state.products_to_order[index][name] = value;
        },
        change_prod_amounts: (state, action) => {
            const { id, index, name, value, sizeId } = action.payload;

            if (name === "size") {
                const sizesArray = state.products_to_order[id].amounts[index].sizes;
                
                // Ищем существует ли уже этот размер
                const sizeIndex = sizesArray.findIndex(s => s.size === sizeId);
        
                if (parseInt(value) > 0) {
                    if (sizeIndex === -1) {
                        // Если размер не найден, добавляем новый
                        sizesArray.push({ size: sizeId, amount: value });
                    } else {
                        // Если размер уже есть, обновляем количество
                        sizesArray[sizeIndex].amount = value;
                    }
                } else {
                    // Если значение = 0, удаляем размер из массива
                    if (sizeIndex !== -1) {
                        sizesArray.splice(sizeIndex, 1);
                    }
                }
            } else {
                state.products_to_order[id].amounts[index][name] = value;
            }
        },
        addAmount: (state) => {
            state.products_to_order[0].amounts.push({
                color: '',
                sizes: []
            })
        },
        deleteAmount: (state, action) => {
            const { id, index } = action.payload;
            state.products_to_order[id].amounts.splice(index, 1);
        },
        clearAll: (state) => {
            state.products_to_order = [
                {
                    nomenclature: '',
                    price: '',
                    cost_price: '',
                    amounts: [
                        {
                            color: '',
                            size: '',
                            amount: ''
                        }
                    ]
                }
            ]
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrderClientList.pending, (state) => {
                state.client_list_status = 'loading';
            }).addCase(getOrderClientList.fulfilled, (state, action) => {
                state.client_list_status = 'success';
                state.client_list = action.payload
            }).addCase(getOrderClientList.rejected, (state) => {
                state.client_list_status = 'error';
            })
            // --------------------------------------------------
            .addCase(getOrderProductList.pending, (state) => {
                state.product_list_status = 'loading';
            }).addCase(getOrderProductList.fulfilled, (state, action) => {
                state.product_list_status = 'success';
                state.product_list = action.payload
            }).addCase(getOrderProductList.rejected, (state) => {
                state.product_list_status = 'error';
            })
            // --------------------------------------------------
            .addCase(getOrderList.pending, (state) => {
                state.order_list_status = 'loading';
            }).addCase(getOrderList.fulfilled, (state, action) => {
                state.order_list_status = 'success';
                state.order_list = action.payload
            }).addCase(getOrderList.rejected, (state) => {
                state.order_list_status = 'error';
            })
            // --------------------------------------------------
            .addCase(getModerationList.pending, (state) => {
                state.moderation_list_status = 'loading';
            }).addCase(getModerationList.fulfilled, (state, action) => {
                state.moderation_list_status = 'success';
                state.moderation_list = action.payload
            }).addCase(getModerationList.rejected, (state) => {
                state.moderation_list_status = 'error';
            })
            // --------------------------------------------------
            .addCase(acceptOperation.pending, (state) => {
                state.accept_operation_status = 'loading';
            }).addCase(acceptOperation.fulfilled, (state) => {
                state.accept_operation_status = 'success';
            }).addCase(acceptOperation.rejected, (state) => {
                state.accept_operation_status = 'error';
            })
    }
})

export const { change_prod_amounts, change_prod_main, addAmount, deleteAmount, clearAll, addProduct, deleteProduct } = TechnologOrderSlice.actions;
export default TechnologOrderSlice;