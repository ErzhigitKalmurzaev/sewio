import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const getPartyList = createAsyncThunk(
    'foreman/getPartyList',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('work/get-party-info/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const ForemanOrderSlice = createSlice({
  name: 'foreman',
  initialState: {
    party_list: null,
    party_list_status: 'loading'
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
        .addCase(getPartyList.pending, (state) => {
            state.party_list_status = 'loading';
        }).addCase(getPartyList.fulfilled, (state, action) => {
            state.party_list = action.payload;
            state.party_list_status = 'success';
        }).addCase(getPartyList.rejected, (state) => {
            state.party_list_status = 'error';
        })
    }
});

export const {  } = ForemanOrderSlice.actions;
export default ForemanOrderSlice;
