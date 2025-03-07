import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import CRMLayout from '../layouts/crm/CRMLayout';
import MySalary from '../pages/shveya/salary/main';
import ShveyaMobileLayout from '../layouts/mobile/ShveyaMobileLayout';
import MySalaryDetail from '../pages/shveya/salary/mySalaryDetail';
import OrdersList from '../pages/kroi/order/main';
import CreateParty from '../pages/kroi/order/party/createParty';
import PartyHistory from '../pages/kroi/order/party/partyHistory';

const KroiRoute = () => {

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

            <Route path='orders' element={<Outlet/>}>
                <Route path='' element={<OrdersList/>}/>
                <Route path='history' element={<PartyHistory/>}/>
                <Route path=':orderId/:id' element={<CreateParty/>}/>
            </Route>
        </Route>
    </Routes>
  )
};

export default KroiRoute;
