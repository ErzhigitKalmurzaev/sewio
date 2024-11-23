// components/AllRoutes.js
import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TechnologRoute from './technologRoute';
import { checkAuth, getProfile } from '../store/auth/auth';
import SignIn from './../pages/auth/signIn';
import WarehouseRoute from './warehouseRoute';

const AllRoutes = () => {
  const { isAuthenticated, me_info } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(getProfile());
  }, [me_info?.role, isAuthenticated]);

  const routes = {
    director: <TechnologRoute/>,
    technolog: <TechnologRoute/>,
    shveya: <TechnologRoute />,
    warehouse: <WarehouseRoute/>,
  }

  const allowedCRMRoles = ['director', 'technolog', 'shveya', 'warehouse',];
  
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
