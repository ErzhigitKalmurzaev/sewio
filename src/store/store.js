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
import OperationSlice from "./technolog/operations";
import ShveyaOperationSlice from "./shveya/operation";
import ShveyaSalarySlice from "./shveya/salary";
import StatisticSlice from "./technolog/statistic";
import CalculationSlice from "./technolog/calculation";
import KroiOrderSlice from "./kroi/order";
import ForemanOrderSlice from "./foreman/order";

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
        operation: OperationSlice.reducer,
        statistic: StatisticSlice.reducer,
        calculation: CalculationSlice.reducer,

        //Warehouse
        ware_materials: WarehouseMaterialSlice.reducer,
        ware_warehouse: WareWarehouseSlice.reducer,

        //Shveya 
        sh_operation: ShveyaOperationSlice.reducer,
        sh_salary: ShveyaSalarySlice.reducer,

        //Kroi
        kroi_order: KroiOrderSlice.reducer,

        //Foreman
        foreman_order: ForemanOrderSlice.reducer
    }
})

export default store;