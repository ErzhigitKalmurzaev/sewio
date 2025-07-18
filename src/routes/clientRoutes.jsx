import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import ShveyaMobileLayout from './../layouts/mobile/ShveyaMobileLayout';
import CRMLayout from './../layouts/crm/CRMLayout';
import OrdersList from '../pages/client/main';
import OrderDetail from '../pages/client/orderDetail';

const ClientRoute = () => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, [window.innerWidth])

  return (
    <Routes>
        <Route path="/*" element={windowWidth < 768 ? <ShveyaMobileLayout/> : <CRMLayout />}>
            <Route index element={<Navigate to="orders" replace />} /> 
            
            <Route path="orders" element={<Outlet/>}>
                <Route path="" element={<OrdersList/>} />
                <Route path=":id" element={<OrderDetail />} />
            </Route>
        </Route>
    </Routes>
  )
};

export default ClientRoute;