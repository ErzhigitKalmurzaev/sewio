import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import CRMLayout from '../layouts/crm/CRMLayout';
import MySalary from '../pages/shveya/salary/main';
import MyOperations from '../pages/shveya/operations/main';
import ShveyaMobileLayout from '../layouts/mobile/ShveyaMobileLayout';
import MySalaryDetail from '../pages/shveya/salary/mySalaryDetail';

const ShveyaRoute = () => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, [window.innerWidth])

  return (
    <Routes>
        <Route path="/*" element={windowWidth < 768 ? <ShveyaMobileLayout/> : <CRMLayout />}>
            <Route index element={<Navigate to="salary" replace />} /> 
            
            <Route path="salary" element={<Outlet/>}>
                <Route path="" element={<MySalary />} />
                <Route path=":id" element={<MySalaryDetail />} />
            </Route>

            <Route path='operations' element={<Outlet/>}>
                <Route path='' element={<MyOperations/>}/>
            </Route>
        </Route>
    </Routes>
  )
};

export default ShveyaRoute;