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
            const { data } =  await axiosInstance.get(`order/list/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getProductToOrderById = createAsyncThunk(
    'order/getProductToOrderById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`product/detail/${id}/`);
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
        product_status: 'loading',

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
        ],
        edit_products_in_order: [
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
        ],
        order_parties: []
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
                let sizesArray = state.products_to_order[id].amounts[index].sizes || [];
        
                // Находим индекс существующего размера
                let sizeIndex = sizesArray.findIndex(s => s.size === sizeId);
        
                if (parseInt(value) > 0) {
                    if (sizeIndex === -1) {
                        // Если размер не найден, добавляем новый
                        sizesArray.push({ size: sizeId, amount: value });
                    } else {
                        // Если размер уже есть, обновляем количество
                        sizesArray[sizeIndex].amount = value;
                    }
                } else if (sizeIndex !== -1) {
                    // Если значение = 0, удаляем размер из массива
                    sizesArray.splice(sizeIndex, 1);
                }
        
                // Обновляем массив без дубликатов
                state.products_to_order[id].amounts[index].sizes = sizesArray;
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
        },

        change_edit_prod_amounts: (state, action) => {
            const { index, colorId, sizeId, value, name } = action.payload;

            state.edit_products_in_order = state.edit_products_in_order.map((product, i) => {
                if (i !== index) return product;
    
                return {
                    ...product,
                    amounts: product.amounts.map(colorGroup => {
                        if (colorGroup.color !== colorId) return colorGroup;
    
                        return {
                            ...colorGroup,
                            sizes: colorGroup.sizes.map(sizeItem => {
                                if (sizeItem.size.id !== sizeId) return sizeItem;
    
                                return {
                                    ...sizeItem,
                                    [name]: value
                                };
                            })
                        };
                    })
                };
            })
    
        },
        change_edit_prod_main: (state, action) => {
            const { index, name, value } = action.payload;
    
            state.edit_products_in_order[index][name] = Number(value);
        },
        delete_edit_prod: (state, action) => {
            const { index } = action.payload;
    
            state.edit_products_in_order.splice(index, 1);
        },
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
            // --------------------------------------------------
            .addCase(getOrderById.pending, (state) => {
                state.order_status = 'loading';
            }).addCase(getOrderById.fulfilled, (state, action) => {
                state.order_status = 'success';
                state.edit_products_in_order = action.payload?.products?.map(item => ({
                    nomenclature: item?.nomenclature?.id,
                    title: item?.nomenclature?.title,
                    vendor_code: item?.nomenclature?.vendor_code,
                    price: item?.price,
                    time: item?.time,
                    cost_price: item?.cost_price,
                    true_price: item?.true_price,
                    true_cost_price: item?.true_cost_price,
                    amounts: Object.values(
                      item.amounts.reduce((acc, amount) => {
                        const colorId = amount.color.id;
                  
                        if (!acc[colorId]) {
                          acc[colorId] = {
                            color: colorId,
                            sizes: []
                          };
                        }
                  
                        acc[colorId].sizes.push({
                          size: amount.size ?? { id: null, title: "Нет размера" }, // Если size=null, добавляем заглушку
                          amount: amount.amount,
                          cut: amount.cut,
                          done: amount.done,
                          defect: amount.defect,
                          otk: amount.otk
                        });
                  
                        return acc;
                      }, {})
                    )
                }));
                state.order_parties = action.payload?.parties?.map(item => ({
                    created_at: item.created_at,
                    staff: item.staff,
                    number: item.number,
                    amounts: Object.values(
                        item.details.reduce((acc, amount) => {
                          const colorId = amount.color.id;
                    
                          if (!acc[colorId]) {
                            acc[colorId] = {
                              color: colorId,
                              sizes: []
                            };
                          }
                    
                          acc[colorId].sizes.push({
                            size: amount.size ?? { id: null, title: "Нет размера" }, // Если size=null, добавляем заглушку
                            plan_amount: amount.plan_amount,
                            true_amount: amount.true_amount
                          });
                    
                          return acc;
                        }, {})
                      )
                }))
                  
            }).addCase(getOrderById.rejected, (state) => {
                state.order_status = 'error';
            })
            // --------------------------------------------------
            .addCase(getProductToOrderById.pending, (state) => {
                state.product_status = 'loading';
            }).addCase(getProductToOrderById.fulfilled, (state, action) => {
                const prod = action.payload;
                state.product_status = 'success';
                state.products_to_order = [
                    {
                        nomenclature: prod.id,
                        title: prod.title,
                        price: '',
                        cost_price: prod.cost_price,
                        amounts: [
                            {
                                color: '',
                                sizes: []
                            }
                        ]
                    }
                ];
            }).addCase(getProductToOrderById.rejected, (state) => {
                state.product_status = 'error';
            })
            
    }
})

export const { change_prod_amounts, delete_edit_prod, change_prod_main, change_edit_prod_main, addAmount, deleteAmount, clearAll, addProduct, deleteProduct, change_edit_prod_amounts } = TechnologOrderSlice.actions;
export default TechnologOrderSlice;