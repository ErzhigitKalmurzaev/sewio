import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import CRMLayout from '../layouts/crm/CRMLayout';
import MyWarehouse from '../pages/warehouse/myWarehouse';
import ReplenishmentWarehouse from '../pages/warehouse/replenishment/replenishmentWarehouse';
import RejectMaterials from '../pages/warehouse/reject/rejectMaterials';

const WarehouseRoute = () => {
  return (
    <Routes>
        <Route path="/*" element={<CRMLayout />}>
            <Route index element={<Navigate to="main" replace />} /> 
            
            <Route path="main" element={<Outlet/>}>
                <Route path="" element={<MyWarehouse />} />
                <Route path="fill" element={<ReplenishmentWarehouse/>}/>
                <Route path="reject" element={<RejectMaterials/>}/>
            </Route>
        </Route>
    </Routes>
  )
};

export default WarehouseRoute;
