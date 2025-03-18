import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import BackDrop from '../components/ui/backdrop';

// Ленивая загрузка компонентов
const CRMLayout = lazy(() => import('../layouts/crm/CRMLayout'));
const MyWarehouse = lazy(() => import('../pages/warehouse/myWarehouse'));
const ReplenishmentWarehouse = lazy(() => import('../pages/warehouse/replenishment/replenishmentWarehouse'));
const RejectMaterials = lazy(() => import('../pages/warehouse/reject/rejectMaterials'));
const IssueMaterials = lazy(() => import('../pages/warehouse/issue/issueMaterials'));
const Comings = lazy(() => import('../pages/warehouse/coming/comings'));
const ComingDeteil = lazy(() => import('../pages/warehouse/coming/comingDeteil'));

const WarehouseRoute = () => {
  return (
    <Suspense fallback={<BackDrop/>}>
      <Routes>
        <Route path="/*" element={<CRMLayout />}>
          <Route index element={<Navigate to="main" replace />} />

          <Route path="main" element={<Outlet />}>
            <Route path="" element={<MyWarehouse />} />
            <Route path="fill" element={<ReplenishmentWarehouse />} />
            <Route path="reject" element={<RejectMaterials />} />
            <Route path="issue" element={<IssueMaterials />} />
            <Route path="coming" element={<Outlet />}>
              <Route path="" element={<Comings />} />
              <Route path=":id" element={<ComingDeteil />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default WarehouseRoute;
