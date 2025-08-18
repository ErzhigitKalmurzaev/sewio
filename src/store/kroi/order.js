import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import { color } from "framer-motion";

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
            const { data } =  await axiosInstance.post(`work/party/crud/`, props);
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
            const { data } =  await axiosInstance.patch(`work/party/crud/${id}/`, props);
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
                nomenclature: '',
                color: '',
                passport_length: '',
                table_length: '',
                layers_count: '',
                number_of_marker: '',
                restyled: '',
                defect: '',
                remainder: '',
                fact_length: '',
                fail: '',
                count_in_layer: '',
                is_main: false
            }
        ],
        party_list: null,
        party_list_status: 'loading',
        party: null,
        party_status: 'loading',
        party_active_sizes: [],
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
            const { index, name, value, select_sizes } = action.payload;
        
            if (!state.party_consumables[index]) return;
        
            const item = state.party_consumables[index];
            item[name] = value;
        
            const toNum = (v) => Number(v) || 0;
        
            const {
                table_length = 0,
                layers_count = 0,
                restyled = 0,
                defect = 0,
                remainder = 0,
            } = item;
        
            const shouldUpdateFactLength = ['table_length', 'layers_count', 'restyled', 'defect', 'remainder'].includes(name);
            const shouldUpdateFail = shouldUpdateFactLength || name === 'passport_length';
        
            if (shouldUpdateFactLength) {
                item.fact_length =
                    (toNum(table_length) * toNum(layers_count) +
                    toNum(restyled) +
                    toNum(defect) +
                    toNum(remainder)).toFixed(2);
            }
        
            if (shouldUpdateFail) {
                item.fail = toNum(item.passport_length) - toNum(item.fact_length);
            }
        
            if (['is_main', 'layers_count', 'count_in_layer', 'color'].includes(name)) {
                const mainConsumables = state.party_consumables.filter(c =>
                    c.is_main &&
                    c.color &&
                    c.count_in_layer &&
                    c.layers_count
                );
        
                const sizes = select_sizes || state.party_active_sizes || [];
        
                state.party_amounts = state.party_amounts.map((amountEntry) => {
                    const matchingConsumables = mainConsumables.filter(
                        c => c.color === amountEntry.color.id
                    );
        
                    if (!matchingConsumables.length) return amountEntry;
        
                    const total = matchingConsumables.reduce(
                        (sum, c) => sum + toNum(c.layers_count) * toNum(c.count_in_layer),
                        0
                    );
        
                    const sizeCount = sizes.length;
                    const distributed = Math.floor(total / sizeCount);
                    const extra = total % sizeCount;
                    
                    return {
                        ...amountEntry,
                        totalAmount: total,
                        sizes: amountEntry.sizes.map((sizeEntry, i) => {
                          const hasMatch = sizes.some(size => size.id === sizeEntry.size.id);
                      
                          return {
                            ...sizeEntry,
                            true_amount: hasMatch ? distributed + (i < extra ? 1 : 0) : 0, // или другая логика
                          };
                        })
                    };
                });
            }
        },                      
        updatePartyAmountsBySelectedSizes: (state, action) => {
            const { select_sizes } = action.payload;
        
            state.party_amounts.forEach((colorEntry) => {
                const activeSizeIds = select_sizes.map(s => s.id);
        
                // находим первый выбранный размер с ненулевым true_amount
                const baseTrueAmount = colorEntry.sizes.find(
                    s => activeSizeIds.includes(s.size.id) && !!s.true_amount
                )?.true_amount;
        
                colorEntry.sizes.forEach((s) => {
                    if (activeSizeIds.includes(s.size.id)) {
                        // если true_amount уже был — не трогаем
                        if (!s.true_amount && baseTrueAmount !== undefined) {
                            s.true_amount = baseTrueAmount;
                        }
                    } else {
                        s.true_amount = '';
                    }
                });
            });
        
            // обновляем party_consumables
            state.party_consumables = state.party_consumables?.map(item => ({
                ...item,
                count_in_layer: select_sizes?.length || 0
            }));
        },              
        fillPartyConsumables: (state, action) => {
            state.party_consumables = action.payload?.data?.map(item => ({
                title: item.title,
                nomenclature: item.id,
                passport_length: item.coefficient * item.stock_amount,
                color: item.color,
                table_length: '',
                layers_count: '',
                number_of_marker: '',
                restyled: '',
                defect: '',
                remainder: '',
                fact_length: '',
                fail: '',
                count_in_layer: action.payload.sizes?.length,
                is_main: item.is_main || false
            }))
        },
        addPartyConsumable: (state) => {
            state.party_consumables.push({
                title: '',
                nomenclature: '',
                color: '',
                passport_length: '',
                table_length: '',
                layers_count: '',
                number_of_marker: '',
                restyled: '',
                defect: '',
                remainder: '',
                fact_length: '',
                fail: '',
                count_in_layer: '',
                is_main: false
            })
        },
        deletePartyConsumable: (state, action) => {
            state.party_consumables.splice(action.payload, 1);
        },
        clearAll: (state) => {
            state.party_consumables = [
                {
                    title: '',
                    nomenclature: '',
                    color: '',
                    passport_length: '',
                    table_length: '',
                    layers_count: '',
                    number_of_marker: '',
                    restyled: '',
                    defect: '',
                    remainder: '',
                    fact_length: '',
                    fail: '',
                    count_in_layer: '',
                    is_main: false
                }
            ]
        },
        changePartyNumber: (state, action) => {
            state.party.number = action.payload.value
        },
        changeActiveSizes: (state, action) => {
            state.party_active_sizes = action.payload
        },
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
                state.party_active_sizes = [];
            }).addCase(getProductInfo.fulfilled, (state, action) => {
                const sizes_list = action.payload?.amounts?.filter((obj, index, self) =>
                index === self.findIndex((o) => o.size.id === obj.size.id)
                ).map(item => item.size);

                state.product_info_status = 'success';
                state.product_info = action.payload;
                state.party_active_sizes = sizes_list;
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
                state.party_active_sizes = [];
            }).addCase(getPartyById.fulfilled, (state, action) => {
                const sizes_list = action.payload?.details?.length > 0 ? action.payload?.details?.filter((obj, index, self) =>
                index === self.findIndex((o) => o.size.id === obj.size.id)
                ).map(item => item.size) : [];

                state.party_status = 'success';
                state.party = action.payload;
                state.party_consumables = action.payload.consumptions.map(item => ({
                    title: item.nomenclature?.title,
                    nomenclature: item.nomenclature.id,
                    color: item.nomenclature?.color,
                    passport_length: item.passport_length,
                    table_length: item.table_length,
                    layers_count: item.layers_count,
                    number_of_marker: item.number_of_marker,
                    restyled: item.restyled,
                    defect: item.defect,
                    remainder: item.remainder,
                    fact_length: item.fact_length,
                    fail: item.fail,
                    count_in_layer: sizes_list?.length,
                    is_main: item.is_main
                }))
                state.party_active_sizes = sizes_list;
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
               clearAll, changePartyNumber, changeActiveSizes, updatePartyAmountsBySelectedSizes } = KroiOrderSlice.actions;
export default KroiOrderSlice;