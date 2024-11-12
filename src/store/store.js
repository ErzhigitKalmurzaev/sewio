import { configureStore } from "@reduxjs/toolkit";
import TechnologProductSlice from "./technolog/product";
import authSlice from './auth/auth';
import TechnologRankSlice from "./technolog/rank";
import TechnologStaffSlice from "./technolog/staff";
import TechnologClientSlice from "./technolog/client";
import TechnologSizeSlice from "./technolog/size";
import EquipmentSlice from "./technolog/equipment";
import MaterialSlice from "./technolog/material";
import TechnologOrderSlice from "./technolog/order";

const store = configureStore({
    reducer: {
        //Auth
        auth: authSlice.reducer,

        // Technolog
        tech_product: TechnologProductSlice.reducer,
        rank: TechnologRankSlice.reducer,
        staff: TechnologStaffSlice.reducer,
        client: TechnologClientSlice.reducer,
        size: TechnologSizeSlice.reducer,
        product: TechnologProductSlice.reducer,
        equipment: EquipmentSlice.reducer,
        material: MaterialSlice.reducer,
        order: TechnologOrderSlice.reducer
    }
})

export default store;