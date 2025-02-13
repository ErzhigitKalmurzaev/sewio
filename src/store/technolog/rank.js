import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const getRankList = createAsyncThunk(
    'rank/getRankList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } =  await axiosInstance.get('general/rank/crud/');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createRank = createAsyncThunk(
    'rank/createRank',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('general/rank/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editingRank = createAsyncThunk(
    'rank/editingRank',
    async ({id, props}, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`general/rank/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const TechnologRankSlice = createSlice({
    name: 'rank',
    initialState: {
        rank_list: null,
        rank_list_status: 'loading'
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getRankList.pending, (state) => {
                state.rank_list_status = 'loading';
            }).addCase(getRankList.fulfilled, (state, action) => {
                state.rank_list_status = 'success';
                state.rank_list = action.payload
            }).addCase(getRankList.rejected, (state) => {
                state.rank_list_status = 'error';
            })
    }
})

export const TechnologRankActions = TechnologRankSlice.actions;
export default TechnologRankSlice;