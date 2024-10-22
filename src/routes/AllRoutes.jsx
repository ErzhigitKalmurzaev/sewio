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

  return (
    <Routes>
      <Route path="/" element={isAuthenticated === 'success' ? <Navigate to="/crm/" /> : <SignIn />} />

      <Route path="/crm/*" element={
        <ProtectedRoute>
          <TechnologRoute />
        </ProtectedRoute>
      } />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated !== 'success') {
    return <Navigate to="/" />;
  }

  return children;
};

export default AllRoutes;
