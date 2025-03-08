import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import { addConsumable } from "../technolog/product";

export const getOrdersList = createAsyncThunk(
    'order/getOrdersList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`work/order-info/list/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getProductInfo = createAsyncThunk(
    'order/getProductInfo',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post(`work/product-info/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postParty = createAsyncThunk(
    'order/postParty',
    async (props, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.post(`work/party/create/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getPartyList = createAsyncThunk(
    'order/getPartyList',
    async ({ page, page_size }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`work/party/list/?page=${page}&page_size=${page_size}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getPartyById = createAsyncThunk(
    'order/getPartyById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`work/party/list/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const patchParty = createAsyncThunk(
    'order/patchParty',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.patch(`work/party/list/${id}/`, props);
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
        product_info: null,
        product_info_status: 'loading',
        party_amounts: [],
        party_consumables: [
            {
                title: '',
                consumption: '',
                defect: '',
                left: '',
                unit: ''
            }
        ],
        party_list: null,
        party_list_status: 'loading',
        party: null,
        party_status: 'loading'
    },
    reducers: {
        fillPartyAmounts: (state, action) => {
            state.party_amounts = action.payload
        },
        getValueAmount: (state, action) => {
            const { index, value, sIndex } = action.payload;

            state.party_amounts[index].sizes[sIndex].true_amount = value;
        },
        getValueConsumables: (state, action) => {
            const { index, name, value } = action.payload;
            
            state.party_consumables[index][name] = value;
        },
        fillPartyConsumables: (state, action) => {
            state.party_consumables[action.payload.key] = action.payload.value;
        },
        addPartyConsumable: (state) => {
            state.party_consumables.push({
                title: '',
                consumption: '',
                defect: '',
                left: '',
                unit: ''
            })
        },
        deletePartyConsumable: (state, action) => {
            state.party_consumables.splice(action.payload, 1);
        },
        clearAll: (state) => {
            state.party_consumables = [
                {
                    title: '',
                    consumption: '',
                    defect: '',
                    left: '',
                    unit: ''
                }
            ]
        },
        changePartyNumber: (state, action) => {
            state.party.number = Number(action.payload.value)
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
            .addCase(getProductInfo.pending, (state) => {
                state.product_info_status = 'loading';
            }).addCase(getProductInfo.fulfilled, (state, action) => {
                state.product_info_status = 'success';
                state.product_info = action.payload;
                state.party_amounts = Object.values(
                    action.payload?.amounts?.reduce((acc, item) => {
                      const colorId = item?.color?.id;
                  
                      if (!acc[colorId]) {
                        acc[colorId] = {
                          color: item?.color,
                          sizes: [],
                          totalAmount: 0
                        };
                      }
                  
                      acc[colorId].sizes.push({
                        size: item.size,
                        plan_amount: item.amount,
                        true_amount: ''
                      });
                  
                      acc[colorId].totalAmount += item.amount;
                  
                      return acc;
                    }, {})
                );
            }).addCase(getProductInfo.rejected, (state) => {
                state.product_info_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getPartyList.pending, (state) => {
                state.party_list_status = 'loading';
            }).addCase(getPartyList.fulfilled, (state, action) => {
                state.party_list_status = 'success';
                state.party_list = action.payload
            }).addCase(getPartyList.rejected, (state) => {
                state.party_list_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getPartyById.pending, (state) => {
                state.party_status = 'loading';
            }).addCase(getPartyById.fulfilled, (state, action) => {
                state.party_status = 'success';
                state.party = action.payload;
                state.party_consumables = action.payload.consumptions.map(item => ({
                    title: item.nomenclature?.title,
                    consumption: item.consumption,
                    defect: item.defect,
                    left: item.left,
                    unit: item.nomenclature?.unit
                }))
                state.party_amounts = Object.values(
                    action.payload?.details?.reduce((acc, item) => {
                      const colorId = item?.color?.id;
                  
                      if (!acc[colorId]) {
                        acc[colorId] = {
                          color: item?.color,
                          sizes: [],
                          totalAmount: 0
                        };
                      }
                  
                      acc[colorId].sizes.push({
                        size: item.size,
                        plan_amount: item.plan_amount,
                        true_amount: item.true_amount
                      });
                  
                      acc[colorId].totalAmount += item.true_amount;
                  
                      return acc;
                    }, {})
                );
            }).addCase(getPartyById.rejected, (state) => {
                state.party_status = 'error';
            })
    }
})

export const { fillPartyAmounts, getValueAmount, 
               fillPartyConsumables, addPartyConsumable, 
               deletePartyConsumable, getValueConsumables,
               clearAll, changePartyNumber } = KroiOrderSlice.actions;
export default KroiOrderSlice;