import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getStatistic = createAsyncThunk(
    'rank/getStatistic',
    async ({ date }, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get(`dashboard/statistic/?date=${date}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const StatisticSlice = createSlice({
    name: 'statistic',
    initialState: {
        statistic_list: null,
        statistic_list_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getStatistic.pending, (state) => {
                state.statistic_list_status = 'loading';
            }).addCase(getStatistic.fulfilled, (state, action) => {
                state.statistic_list_status = 'success';
                state.statistic_list = action.payload
            }).addCase(getStatistic.rejected, (state) => {
                state.statistic_list_status = 'error';
            })
    }
})

export const StatisticActions = StatisticSlice.actions;
export default StatisticSlice;