// components/AllRoutes.js
import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TechnologRoute from './technologRoute';
import { checkAuth } from '../store/auth/auth';
import SignIn from './../pages/auth/signIn';

const AllRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  const routes = {
    director: <TechnologRoute/>,
    technolog: <TechnologRoute/>
  }

  const allowedCRMRoles = ['director', 'technolog', 'werehouse', 'shveya'];

  return (
    <Routes>
      <Route path="/" element={isAuthenticated === 'success' ? <Navigate to="/crm/" /> : <SignIn />} />

      <Route path="/crm/*" element={
        <ProtectedRoute navigate="/"
            allowed={allowedCRMRoles.some(i => i === 'director')} >
            {routes['director']}
        </ProtectedRoute>
      } />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};

export const ProtectedRoute = ({ allowed, navigate, children }) => {
  return allowed ? children : <Navigate to={navigate} replace />;
};

export default AllRoutes;
