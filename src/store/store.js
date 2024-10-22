import { configureStore } from "@reduxjs/toolkit";
import TechnologProductSlice from "./technolog/product";
import authSlice from './auth/auth';

const store = configureStore({
    reducer: {
        //Auth
        auth: authSlice.reducer,

        // Technolog
        tech_product: TechnologProductSlice.reducer
    }
})

export default store;