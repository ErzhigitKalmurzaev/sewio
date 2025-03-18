import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import BackDrop from '../components/ui/backdrop';

// Ленивая загрузка компонентов
const CRMLayout = lazy(() => import('../layouts/crm/CRMLayout'));
const ShveyaMobileLayout = lazy(() => import('../layouts/mobile/ShveyaMobileLayout'));
const MySalary = lazy(() => import('../pages/shveya/salary/main'));
const MySalaryDetail = lazy(() => import('../pages/shveya/salary/mySalaryDetail'));
const OrdersList = lazy(() => import('../pages/kroi/order/main'));
const CreateParty = lazy(() => import('../pages/kroi/order/party/createParty'));
const PartyHistory = lazy(() => import('../pages/kroi/order/party/partyHistory'));
const EditParty = lazy(() => import('../pages/kroi/order/party/editParty'));

const KroiRoute = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Suspense fallback={<BackDrop/>}>
      <Routes>
        <Route path="/*" element={windowWidth < 768 ? <ShveyaMobileLayout /> : <CRMLayout />}>
          <Route index element={<Navigate to="salary" replace />} />

          <Route path="salary" element={<Outlet />}>
            <Route path="" element={<MySalary />} />
            <Route path=":id" element={<MySalaryDetail />} />
          </Route>

          <Route path="orders" element={<Outlet />}>
            <Route path="" element={<OrdersList />} />
            <Route path="history" element={<PartyHistory />} />
            <Route path="history/:id" element={<EditParty />} />
            <Route path=":orderId/:id" element={<CreateParty />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default KroiRoute;
