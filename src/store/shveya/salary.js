import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getMySalaryList = createAsyncThunk(
    'salary/getMySalaryList',
    async ({ urls }, { rejectWithValue }) => {
        try {
            const { page, page_size, from_date, to_date } = urls;

            const { data } =  await axiosInstance.get(`payment/history/list/my/?page=${page}&page_size=${page_size}&from_date=${from_date}&to_date=${to_date}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getMySalaryDetail = createAsyncThunk(
    'salary/getMySalaryDetail',
    async ({ id }, { rejectWithValue }) => {
        try {

            const { data } =  await axiosInstance.get(`payment/history/detail/my/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const ShveyaSalarySlice = createSlice({
    name: 'salary',
    initialState: {
        salary_list: null,
        salary_list_status: 'loading',
        payment_detail: null,
        payment_detail_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getMySalaryList.pending, (state) => {
                state.salary_list_status = 'loading';
            }).addCase(getMySalaryList.fulfilled, (state, action) => {
                state.salary_list_status = 'success';
                state.salary_list = action.payload
            }).addCase(getMySalaryList.rejected, (state) => {
                state.salary_list_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getMySalaryDetail.pending, (state) => {
                state.payment_detail_status = 'loading';
                state.payment_detail = null
            }).addCase(getMySalaryDetail.fulfilled, (state, action) => {
                state.payment_detail_status = 'success';
                state.payment_detail = action.payload
            }).addCase(getMySalaryDetail.rejected, (state) => {
                state.payment_detail_status = 'error';
            })
    }
})

export const ShveyaSalaryActions = ShveyaSalarySlice.actions;
export default ShveyaSalarySlice;