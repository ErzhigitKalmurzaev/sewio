import React, { useEffect, useState } from 'react'
import CRMLayout from '../layouts/crm/CRMLayout';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import ForemanMain from '../pages/foreman/operations/main';

const ForemanRoutes = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      setWindowWidth(window.innerWidth);
    }, [window.innerWidth])
  
    return (
      <Routes>
          <Route path="/*" element={<CRMLayout />}>
              <Route index element={<Navigate to="main" replace />} /> 
              
              <Route path="main" element={<Outlet/>}>
                  <Route path="" element={<ForemanMain />} />
                  {/* <Route path=":id" element={<MySalaryDetail />} /> */}
              </Route>

          </Route>
      </Routes>
    )
}

export default ForemanRoutes
