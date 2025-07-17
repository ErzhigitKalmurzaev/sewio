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
            const item = state.party_consumables[index];
          
            // Обновляем значение поля
            item[name] = value;
          
            const toNum = (v) => Number(v) || 0;
          
            // Формулы для вычислений
            const {
              table_length = 0,
              layers_count = 0,
              restyled = 0,
              defect = 0,
              remainder = 0,
              color,
            } = item;
          
            const shouldUpdateFactLength = ['table_length', 'layers_count', 'restyled', 'defect', 'remainder'].includes(name);
            const shouldUpdateFail = shouldUpdateFactLength || name === 'passport_length';
          
            // Пересчет fact_length
            if (shouldUpdateFactLength) {
              item.fact_length =
                toNum(table_length) * toNum(layers_count) +
                toNum(restyled) +
                toNum(defect) +
                toNum(remainder);
            }
          
            // Пересчет fail
            if (shouldUpdateFail) {
              item.fail = toNum(item.passport_length) - toNum(item.fact_length);
            }
          
            // Если изменено одно из: layers_count или count_in_layer — обновляем party_amounts
            if (['layers_count', 'count_in_layer'].includes(name)) {
              const total = toNum(item.layers_count) * toNum(item.count_in_layer);
              const colorId = color;
          
              if (colorId && state.party_amounts?.length > 0) {
                const colorIndex = state.party_amounts.findIndex(p => p.color.id === colorId);
                if (colorIndex !== -1) {
                  const sizes = state.party_amounts[colorIndex].sizes.filter(item => select_sizes?.some(size => item.size.id === size.id));
                  const sizeCount = sizes.length;
          
                  if (sizeCount > 0) {
                    const distributed = Math.floor(total / sizeCount);
                    const remainder = total % sizeCount;
          
                    sizes.forEach((s, i) => {
                      // Распределяем остаток по первым N размерам
                      sizes[i].true_amount = distributed + (i < remainder ? 1 : 0);
                    });
                  }
                }
              }
            }
        },
        updatePartyAmountsBySelectedSizes: (state, action) => {
            const { select_sizes } = action.payload;

            state.party_amounts.forEach((colorEntry) => {
                
                const total = Number(colorEntry.sizes.reduce((sum, s) => sum + Number(s.true_amount), 0));
                const distributed = Math.floor(total / select_sizes?.length);
                const remainder = Number(total % select_sizes?.length);

                colorEntry.sizes.forEach((s, i) =>{
                    if(select_sizes?.some((sel) => sel.id === s.size.id)) {
                        s.true_amount = distributed + (i < remainder ? 1 : 0);
                    } else{ 
                        s.true_amount = ''
                    }
                });
            });
          },
        fillPartyConsumables: (state, action) => {
            state.party_consumables = action.payload?.map(item => ({
                title: item.title,
                nomenclature: item.id,
                passport_length: item.coefficient,
                color: item.color,
                table_length: '',
                layers_count: '',
                number_of_marker: '',
                restyled: '',
                defect: '',
                remainder: '',
                fact_length: '',
                fail: '',
                count_in_layer: '',
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
                state.product_info_status = 'success';
                state.product_info = action.payload;
                state.party_active_sizes = action.payload?.amounts?.filter((obj, index, self) =>
                index === self.findIndex((o) => o.size.id === obj.size.id)
                ).map(item => item.size);
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
                    count_in_layer: item.quantity / item.layers_count
                }))
                state.party_active_sizes = action.payload?.details?.length > 0 ? action.payload?.details?.filter((obj, index, self) =>
                index === self.findIndex((o) => o.size.id === obj.size.id)
                ).map(item => item.size) : [];
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