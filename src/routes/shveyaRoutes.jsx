import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import CRMLayout from '../layouts/crm/CRMLayout';
import MySalary from '../pages/shveya/salary/main';
import MyOperations from '../pages/shveya/operations/main';

const ShveyaRoute = () => {
  return (
    <Routes>
        <Route path="/*" element={<CRMLayout />}>
            <Route index element={<Navigate to="salary" replace />} /> 
            
            <Route path="salary" element={<Outlet/>}>
                <Route path="" element={<MySalary />} />
            </Route>

            <Route path='operations' element={<Outlet/>}>
                <Route path='' element={<MyOperations/>}/>
            </Route>
        </Route>
    </Routes>
  )
};

export default ShveyaRoute;
