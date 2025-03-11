import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ImageUploadingFetch } from "../../api/axios";

export const getStaffList = createAsyncThunk(
    'technologStaff/getStaffList',
    async ({ urls }, { rejectWithValue }) => {
        try {
            const { search, role, is_active } = urls;
            const { data } = await axiosInstance.get(`user/staff/crud/?name=${search}&role=${role}&is_active=${is_active}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const createEmployee = createAsyncThunk(
    'technologStaff/createEmployee',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await ImageUploadingFetch.post('user/staff/crud/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getEmployeeInfo = createAsyncThunk(
    'technologStaff/getEmployeeInfo',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`user/staff/crud/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const editEmployeeInfo = createAsyncThunk(
    'technologStaff/editEmployeeInfo',
    async ({ id, props }, { rejectWithValue }) => {
        try {
            const { data } = await ImageUploadingFetch.patch(`user/staff/crud/${id}/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getStaffPaymentInfo = createAsyncThunk(
    'technologStaff/getStaffPaymentInfo',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`payment/salary-info/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getStaffPaymentDetail = createAsyncThunk(
    'technologStaff/getStaffPaymentDetail',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`payment/history/detail/${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postPayment = createAsyncThunk(
    'technologStaff/postPayment',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`payment/create/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postPaymentFiles = createAsyncThunk(
    'technologStaff/postPaymentFiles',
    async (props, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            for (const key in props) {
                if (key === "files") {
                    for (let i = 0; i < props[key].length; i++) {
                        const item = props[key][i]
                        formData.append(key, item)
                    }
                } else {
                    formData.append(key, props[key])
                }
            }

            const { data } = await ImageUploadingFetch.post(`payment/files/create/`, formData);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const postSalary = createAsyncThunk(
    'technologStaff/postSalary',
    async (props, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`payment/salary/create/`, props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getStaffSalaryHistory = createAsyncThunk(
    'technologStaff/getStaffSalaryHistory',
    async ({ id, urls }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`payment/history/list/${id}/?from_date=${urls.from_date}&to_date=${urls.to_date}`);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const TechnologStaffSlice = createSlice({
    name: 'technologStaff',
    initialState: {
        staff_list: null,
        staff_list_status: 'loading',
        staff_info: {},
        staff_info_status: '',
        payment_info: {},
        payment_info_status: 'loading',
        salary_history: [],
        salary_history_status: 'loading',
        payment_detail: {},
        payment_detail_status: 'loading',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStaffList.pending, (state) => {
                state.staff_list_status = 'loading';
            }).addCase(getStaffList.fulfilled, (state, action) => {
                state.staff_list_status = 'success';
                state.staff_list = action.payload
            }).addCase(getStaffList.rejected, (state) => {
                state.staff_list_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getEmployeeInfo.pending, (state) => {
                state.staff_info_status = 'loading';
            }).addCase(getEmployeeInfo.fulfilled, (state, action) => {
                state.staff_info_status = 'success';
                state.staff_info = action.payload
            }).addCase(getEmployeeInfo.rejected, (state) => {
                state.staff_info_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getStaffPaymentInfo.pending, (state) => {
                state.payment_info_status = 'loading';
            }).addCase(getStaffPaymentInfo.fulfilled, (state, action) => {
                state.payment_info_status = 'success';
                state.payment_info = action.payload
            }).addCase(getStaffPaymentInfo.rejected, (state) => {
                state.payment_info_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getStaffSalaryHistory.pending, (state) => {
                state.salary_history_status = 'loading';
            }).addCase(getStaffSalaryHistory.fulfilled, (state, action) => {
                state.salary_history_status = 'success';
                state.salary_history = action.payload
            }).addCase(getStaffSalaryHistory.rejected, (state) => {
                state.salary_history_status = 'error';
            })
            //---------------------------------------------------------
            .addCase(getStaffPaymentDetail.pending, (state) => {
                state.payment_detail_status = 'loading';
            }).addCase(getStaffPaymentDetail.fulfilled, (state, action) => {
                state.payment_detail_status = 'success';
                state.payment_detail = action.payload
            }).addCase(getStaffPaymentDetail.rejected, (state) => {
                state.payment_detail_status = 'error';
            })
    }
})

export const {  } = TechnologStaffSlice.actions;
export default TechnologStaffSlice;