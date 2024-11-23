import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import CRMLayout from '../layouts/crm/CRMLayout';
import MyWarehouse from '../pages/warehouse/myWarehouse';
import ReplenishmentWarehouse from '../pages/warehouse/replenishment/replenishmentWarehouse';
import RejectMaterials from '../pages/warehouse/reject/rejectMaterials';
import IssueMaterials from '../pages/warehouse/issue/issueMaterials';
import Comings from '../pages/warehouse/coming/comings';
import ComingDeteil from '../pages/warehouse/coming/comingDeteil';

const WarehouseRoute = () => {
  return (
    <Routes>
        <Route path="/*" element={<CRMLayout />}>
            <Route index element={<Navigate to="main" replace />} /> 
            
            <Route path="main" element={<Outlet/>}>
                <Route path="" element={<MyWarehouse />} />
                <Route path="fill" element={<ReplenishmentWarehouse/>}/>
                <Route path="reject" element={<RejectMaterials/>}/>
                <Route path="issue" element={<IssueMaterials/>}/>
                <Route path="coming" element={<Outlet/>}>
                    <Route path="" element={<Comings/>}/>
                    <Route path=":id" element={<ComingDeteil/>}/>
                </Route>
            </Route>
        </Route>
    </Routes>
  )
};

export default WarehouseRoute;
