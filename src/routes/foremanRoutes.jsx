import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import BackDrop from '../components/ui/backdrop';

// Ленивая загрузка компонентов
const CRMLayout = lazy(() => import('../layouts/crm/CRMLayout'));
const ForemanTabletLayout = lazy(() => import('../layouts/tablet/foremanTabletLayout'));
const ForemanMain = lazy(() => import('../pages/foreman/operations/main'));
const CreateAccWork = lazy(() => import('../pages/foreman/operations/works/createAccWork'));
const WorkHistory = lazy(() => import('../pages/foreman/operations/works/workHistory'));
const EditAccWork = lazy(() => import('../pages/foreman/operations/works/editAccWork'));

const ForemanRoutes = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Suspense fallback={<BackDrop open={true} />}>
      <Routes>
        <Route path="/*" element={windowWidth < 1280 ? <ForemanTabletLayout /> : <CRMLayout />}>
          <Route index element={<Navigate to="operations" replace />} />
          <Route path="operations" element={<Outlet />}>
            <Route path="" element={<ForemanMain />} />
            <Route path=":orderId/:id" element={<Outlet />}>
              <Route path="" element={<CreateAccWork />} />
              <Route path="history" element={<WorkHistory />} />
              <Route path="history/:workId" element={<EditAccWork />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ForemanRoutes;
