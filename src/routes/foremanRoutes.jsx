import React, { useEffect, useState } from 'react'
import CRMLayout from '../layouts/crm/CRMLayout';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import ForemanMain from '../pages/foreman/operations/main';
import ForemanTabletLayout from '../layouts/tablet/foremanTabletLayout';
import CreateAccWork from '../pages/foreman/operations/works/createAccWork';

const ForemanRoutes = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      setWindowWidth(window.innerWidth);
    }, [window.innerWidth])
  
    return (
      <Routes>
          <Route path="/*" element={windowWidth < 1280 ? <ForemanTabletLayout/> : <CRMLayout />}>
              <Route index element={<Navigate to="operations" replace />} /> 
              
              <Route path="operations" element={<Outlet/>}>
                  <Route path="" element={<ForemanMain />} />
                  <Route path=":orderId/:id" element={<CreateAccWork />} />
              </Route>

          </Route>
      </Routes>
    )
}

export default ForemanRoutes
