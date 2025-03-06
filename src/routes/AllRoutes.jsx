// components/AllRoutes.js
import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TechnologRoute from './technologRoute';
import { checkAuth, getProfile } from '../store/auth/auth';
import SignIn from './../pages/auth/signIn';
import WarehouseRoute from './warehouseRoute';
import ShveyaRoute from './shveyaRoutes';
import ForemanRoutes from './foremanRoutes';
import KroiRoute from './kroiRoutes';

const AllRoutes = () => {
  const { isAuthenticated, me_info } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuth());
    if(!me_info?.role && isAuthenticated === 'success') {
      dispatch(getProfile());
    }
    if(isAuthenticated === 'error') {
      navigate('/');
    }
  }, [isAuthenticated]);

  const routes = {
    director: <TechnologRoute/>,
    technolog: <TechnologRoute/>,
    shveya: <ShveyaRoute />,
    warehouse: <WarehouseRoute/>,
    kroi: <KroiRoute/>
  }

  const allowedCRMRoles = ['', 'director', 'technolog', 'warehouse', 'shveya', 'kroi'];
  
  return (
    <Routes>
        <Route path="/" element={isAuthenticated === 'success' ? <Navigate to="/crm/" /> : <SignIn />} />
        {
          me_info?.role &&
          <>
            <Route path="/crm/*" element={
              <ProtectedRoute navigate="/"
                  allowed={allowedCRMRoles.some((i, index) => index === (me_info?.role))} >
                  {routes[allowedCRMRoles[me_info?.role]]}
              </ProtectedRoute>
            } />
            <Route path="*" element={<div>Page not found</div>} />
          </>
        }
    </Routes>
  );
};

export const ProtectedRoute = ({ allowed, navigate, children }) => {
  return allowed ? children : <Navigate to={navigate} replace />;
};

export default AllRoutes;
