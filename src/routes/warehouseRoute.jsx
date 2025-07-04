import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import CRMLayout from '../layouts/crm/CRMLayout';
import MyWarehouse from '../pages/warehouse/myWarehouse';
import ReplenishmentWarehouse from '../pages/warehouse/replenishment/replenishmentWarehouse';
import RejectMaterials from '../pages/warehouse/reject/rejectMaterials';
import IssueMaterials from '../pages/warehouse/issue/issueMaterials';
import Comings from '../pages/warehouse/coming/comings';
import ComingDeteil from '../pages/warehouse/coming/comingDeteil';
import ComingHistory from '../pages/warehouse/coming/comingHistory';
import ComingHistoryDeteil from '../pages/warehouse/coming/comingHistoryDetail';
import History from '../pages/warehouse/history/history';
import HistoryDetail from '../pages/warehouse/history/historyDetail';

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
                <Route path="history" element={<Outlet/>}>
                    <Route path="" element={<History/>}/>
                    <Route path=":id" element={<HistoryDetail/>}/>
                </Route>
                <Route path="coming" element={<Outlet/>}>
                    <Route path="" element={<Comings/>}/>
                    <Route path=":id" element={<ComingDeteil/>}/>
                    <Route path="history" element={<ComingHistory/>}/>
                    <Route path="history/:id" element={<ComingHistoryDeteil/>}/>
                </Route>
            </Route>
        </Route>
    </Routes>
  )
};

export default WarehouseRoute;