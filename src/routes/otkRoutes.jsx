import React, { useEffect, useState } from 'react'
import CRMLayout from '../layouts/crm/CRMLayout';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import ForemanMain from '../pages/foreman/operations/main';
import ForemanTabletLayout from '../layouts/tablet/foremanTabletLayout';
import CreateAccWork from '../pages/foreman/operations/works/createAccWork';
import WorkHistory from '../pages/foreman/operations/works/workHistory';
import EditAccWork from '../pages/foreman/operations/works/editAccWork';
import MySalary from '../pages/shveya/salary/main';
import MySalaryDetail from '../pages/shveya/salary/mySalaryDetail';

const OtkRoutes = () => {
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
                  <Route path=":orderId/:id" element={<Outlet/>}>
                      <Route path="" element={<CreateAccWork />} />
                      <Route path="history" element={<WorkHistory />} />
                      <Route path="history/:workId" element={<EditAccWork />} />
                  </Route>
              </Route>

              <Route path="salary" element={<Outlet/>}>
                <Route path="" element={<MySalary />} />
                <Route path=":id" element={<MySalaryDetail />} />
              </Route>
          </Route>
      </Routes>
    )
}

export default OtkRoutes