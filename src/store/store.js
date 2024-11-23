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
import WarehouseSlice from "./technolog/warehouse";
import WarehouseMaterialSlice from "./warehouse/materails";
import WareWarehouseSlice from "./warehouse/warehouse";

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
        order: TechnologOrderSlice.reducer,
        warehouse: WarehouseSlice.reducer,

        //Warehouse
        ware_materials: WarehouseMaterialSlice.reducer,
        ware_warehouse: WareWarehouseSlice.reducer
    }
})

export default store;