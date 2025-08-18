import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";
import { nanoid } from "nanoid";

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

export const getProductFiles = createAsyncThunk(
    'technologProduct/getProductFiles',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`product/${id}/files/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getCombinationsList = createAsyncThunk(
    'technologProduct/getCombinationsList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`sample/combinations/list/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)
export const getCombinationById = createAsyncThunk(
    'technologProduct/getCombinationById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`sample/combinations/list/${id}/`);
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
            
            const { data } = await ImageUploadingFetch.post(`product/images/crud`, formData);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createProductFiles = createAsyncThunk(
    'technologProduct/createProductFiles',
    async ({ props }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in props) {
                if (key === "files" || key === 'delete_ids') {
                    for (let i = 0; i < props[key].length; i++) {
                        const item = props[key][i]
                        formData.append(key, item)
                    }
                } else {
                    formData.append(key, props[key])
                }
            }
            
            const { data } = await ImageUploadingFetch.post(`product/files/crud`, formData);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getProductInfoById = createAsyncThunk(
    'technologProduct/getProductInfoById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`calculation/get-product-info/?product=${id}`);
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
        update_product: false,
        combinations_list: null,
        combination: null,
        combination_status: '',

        operations: [
            {
                title: '',
                time: '',
                rank: '',
                price: '',
                equipment: ''
            }
        ],
        combinations: [

        ],
        consumables: [
            {
                material_nomenclature: '',
                title: '',
                consumption: ''
            }
        ],
        prices: [
            {
                title: '',
                price: ''
            }
        ],
    },
    reducers: {
        setUpdateProduct: (state) => {
            state.update_product = !state.update_product
        },

        clearAll: (state) => {
            state.operations = [
                {
                    title: '',
                    time: '',
                    rank: '',
                    price: ''
                }
            ]
            state.combinations = [
    
            ]
            state.consumables = [
                {
                    material_nomenclature: '',
                    title: '',
                    consumption: '',
                    color: ''
                }
            ]
            state.prices = [
                {
                    title: '',
                    price: ''
                }
            ]
        },

        addOperation: (state) => {
            state.operations.push({
                title: '',
                time: '',
                rank: '',
                price: '',
                equipment: ''
            })
        },
        getValueOperation: (state, action) => {
            state.operations[action.payload.key][action.payload.name] = action.payload.value;
        },
        fillOperation: (state, action) => {
            state.operations[action.payload.key] = action.payload.value;    
        },
        deleteOperation: (state, action) => {
            state.operations.splice(action.payload, 1);
        },


        addCombination: (state, action) => {
            state.combinations.push(action.payload);
        },
        editCombination: (state, action) => {
            const { index, value } = action.payload;

            state.combinations[index].title = value?.title;
            state.combinations[index].status = value?.status;
        },
        getValueOperationInCombination: (state, action) => {
            const { value, name, parentIndex, childIndex } = action.payload;
            
            state.combinations[parentIndex].children[childIndex][name] = value;
        },
        addOperationInCombination: (state, action) => {
            state.combinations[action.payload.key].children.push({
                title: '',
                time: '',
                rank: '',
                price: '',
                id: nanoid()
            })
        },
        reorderCombinations: (state, action) => {
            const { fromIndex, toIndex } = action.payload;
            
            // Создаем копию массива комбинаций
            const newCombinations = [...state.combinations];
            
            // Удаляем элемент из исходной позиции
            const draggedItem = newCombinations.splice(fromIndex, 1)[0];
            
            // Вставляем элемент в новую позицию
            newCombinations.splice(toIndex, 0, draggedItem);
            console.log(newCombinations)
            // Обновляем состояние
            state.combinations = newCombinations;
        },
        fillCombination: (state, action) => {
            const { childIndex, parentIndex, value} = action.payload;

            state.combinations[parentIndex].children[childIndex] = value;    
        },
        deleteOperationInCombination: (state, action) => {
            const { parentIndex, childIndex } = action.payload;

            state.combinations[parentIndex]?.children?.splice(childIndex, 1);
        },
        deleteCombination: (state, action) => {
            state.combinations.splice(action.payload, 1);
        },


        addConsumable: (state) => {
            state.consumables.push({
                nomenclature: '',
                title: '',
                consumption: '',
                unit: ''
            })
        },
        getValueConsumable: (state, action) => {
            state.consumables[action.payload.key][action.payload.name] = action.payload.value;
        },
        fillConsumable: (state, action) => {
            state.consumables[action.payload.key] = action.payload.value;
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
        getValuePrice: (state, action) => {
            state.prices[action.payload.key][action.payload.name] = action.payload.value;
        },
        deletePrice: (state, action) => {
            state.prices.splice(action.payload, 1);
        },
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
                state.combinations = action.payload.combinations.map(item => ({
                    title: item.title,
                    id: item.id,
                    status: item.status,
                    children: item.operations?.map(op => ({
                        ...op
                    }))
                }))
                state.consumables = action.payload.consumables.map(item => ({
                    unit: item?.unit ? item.unit : item?.material_nomenclature?.unit,
                    material_nomenclature: item?.material_nomenclature?.id,
                    consumption: item.consumption,
                    price: item.price,
                    title: item.material_nomenclature?.title,
                    coefficient: item.material_nomenclature?.coefficient
                }));
                state.prices = action.payload.prices;
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
            .addCase(getCombinationsList.fulfilled, (state, action) => {
                state.combinations_list = action.payload
            })
            // ------------------------------------------
            .addCase(getCombinationById.pending, (state) => {
                state.combination_status = 'loading';
            })
            .addCase(getCombinationById.fulfilled, (state, action) => {
                state.combination = action.payload
            })
            .addCase(getCombinationById.rejected, (state) => {
                state.combination_status = 'error';
            })
            
            .addCase(getProductInfoById.pending, (state) => {
                state.product_status = 'kochuruu';
            })
            .addCase(getProductInfoById.fulfilled, (state, action) => {
                state.product_status = 'success';
                state.combinations = action.payload.combinations.map(item => ({
                    title: item.title,
                    id: item.id,
                    status: item.status,
                    children: item.operations?.map(op => ({
                        ...op,
                        rank: op?.rank?.id
                    }))
                }))
                state.consumables = action.payload?.consumables?.map(item => ({
                    title: item.material_nomenclature?.title,
                    consumption: item.consumption,
                    unit: item?.unit,
                    price: item?.price,
                    material_nomenclature: item?.material_nomenclature?.id,
                    color: item?.color?.id
                }));
                state.prices = action.payload?.prices?.map(item => ({
                    title: item.title,
                    price: item.price    
                }));
            })
            .addCase(getProductInfoById.rejected, (state) => {
                state.product_status = 'error';
            })
            // ------------------------------------------
    }
})

export const { setUpdateProduct, getValueOperation, 
               addOperation, fillOperation, 
               deleteOperation, addPrice, 
               getValuePrice, deletePrice,
               getValueOperationInCombination, addCombination, 
               fillCombination, deleteCombination,
               addOperationInCombination, deleteOperationInCombination,
               editCombination, addConsumable, fillConsumable,
               deleteConsumable, getValueConsumable, clearAll,
               reorderCombinations } = TechnologProductSlice.actions;
export default TechnologProductSlice;
