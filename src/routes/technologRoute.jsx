import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import CRMLayout from '../layouts/crm/CRMLayout'
import Statistic from '../pages/technolog/statistic/main'
import Employee from '../pages/technolog/employee/main'
import CreateEmployee from '../pages/technolog/employee/create/createEmployee'
import { Edit } from 'lucide-react'
import EditEmployee from '../pages/technolog/employee/editEmployee'
import SalaryHistory from '../pages/technolog/employee/salary/salaryHistory'
import SalaryPayment from '../pages/technolog/employee/salary/salaryPayment'
import Products from '../pages/technolog/product/main'
import CreateProduct from '../pages/technolog/product/createProduct'
import Orders from '../pages/technolog/orders/main'
import OrderCreate from '../pages/technolog/orders/orderCreate'
import Sklad from '../pages/technolog/sklad/main'
import Discharge from '../pages/technolog/discharge/main'
import Operations from '../pages/technolog/operations/main'
import Equipments from '../pages/technolog/equipments/main'
import DetailSklad from '../pages/technolog/sklad/detailSklad'

const TechnologRoute = () => {
  return (
    <Routes>
        <Route path="/*" element={<CRMLayout/>}>
            <Route exact path='' element={<Navigate to="statistic" />} />
            <Route exact path='statistic' element={<Outlet />}>
                <Route path='' element={<Statistic />} />
            </Route>
            <Route path='employee' element={<Outlet/>}>
                <Route path='' element={<Employee/>} />
                <Route path='create' element={<CreateEmployee/>} />
                <Route path='info'>
                  <Route path='' element={<EditEmployee/>} />
                  <Route path='salary_history' element={<SalaryHistory/>} />
                  <Route path='salary_payment' element={<SalaryPayment/>} />
                </Route>
            </Route>
            <Route path='orders' element={<Outlet/>}>
                <Route path='' element={<Orders/>} />
                <Route path='create' element={<OrderCreate/>} />
            </Route>
            <Route path='product' element={<Outlet/>}>
                <Route path='' element={<Products/>} />
                <Route path='create' element={<CreateProduct/>} />
            </Route>
            <Route path='sklad' element={<Outlet/>}>
                <Route path='' element={<Sklad/>} />
                <Route path=':id' element={<DetailSklad/>} />
            </Route>
            <Route path='discharge' element={<Outlet/>}>
                <Route path='' element={<Discharge/>} />
            </Route>
            <Route path='knowledge' element={<p>База знаний</p>} />
            <Route path='operations' element={<Outlet/>}>
                <Route path='' element={<Operations/>} />
            </Route>
            <Route path='equipments' element={<Outlet/>}>
                <Route path='' element={<Equipments/>} />
            </Route>
        </Route>
    </Routes>
  )
}

export default TechnologRoute
