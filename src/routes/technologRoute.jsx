import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import CRMLayout from '../layouts/crm/CRMLayout'
import Statistic from '../pages/technolog/statistic/main'
import Employee from '../pages/technolog/employee/main'
import CreateEmployee from '../pages/technolog/employee/create/createEmployee'
import EditEmployee from '../pages/technolog/employee/editEmployee'
import SalaryHistory from '../pages/technolog/employee/salary/salaryHistory'
import SalaryPayment from '../pages/technolog/employee/salary/salaryPayment'
import Products from '../pages/technolog/product/main'
import CreateProduct from '../pages/technolog/product/createProduct'
import Orders from '../pages/technolog/orders/main'
import OrderCreate from '../pages/technolog/orders/orderCreate'
import Sklad from '../pages/technolog/sklad/main'
import DetailSklad from '../pages/technolog/sklad/detailSklad'
import Discharge from '../pages/technolog/discharge/main'
import Operations from '../pages/technolog/operations/main'
import Equipments from '../pages/technolog/equipments/main'
import Clients from '../pages/technolog/clients/main'
import CreateClient from '../pages/technolog/clients/create/createClient'
import EditClient from '../pages/technolog/clients/edit/editClient'
import Sizes from '../pages/technolog/sizes/main'
import FillProduct from '../pages/technolog/product/fillProduct'

const TechnologRoute = () => {
  return (
    <Routes>
        <Route path="/*" element={<CRMLayout />}>
            <Route index element={<Navigate to="statistic" replace />} />
            <Route path="statistic" element={<Statistic />} />
            
            <Route path="employee" element={<Outlet />}>
                <Route path="" element={<Employee />} />
                <Route path="create" element={<CreateEmployee />} />
                <Route path=":id">
                  <Route path="" element={<EditEmployee />} />
                  <Route path="salary_history" element={<SalaryHistory />} />
                  <Route path="salary_payment" element={<SalaryPayment />} />
                </Route>
            </Route>

            <Route path="clients" element={<Outlet />}>
                <Route path="" element={<Clients />} />
                <Route path="create" element={<CreateClient />} />
                <Route path=":id" element={<EditClient />} />
            </Route>
            
            <Route path="orders" element={<Outlet />}>
                <Route path="" element={<Orders />} />
                <Route path="create" element={<OrderCreate />} />
            </Route>
            
            <Route path="product" element={<Outlet />}>
                <Route path="" element={<Products />} />
                <Route path="create" element={<CreateProduct />} />
                <Route path=":id" element={<FillProduct/>}/>
            </Route>
            
            <Route path="sklad" element={<Outlet />}>
                <Route path="" element={<Sklad />} />
                <Route path=":id" element={<DetailSklad />} />
            </Route>
            
            <Route path="discharge" element={<Discharge />} />
            <Route path="sizes" element={<Sizes />} />
            <Route path="knowledge" element={<p>База знаний</p>} />
            <Route path="operations" element={<Operations />} />
            <Route path="equipments" element={<Equipments />} />
        </Route>
    </Routes>
  )
}

export default TechnologRoute
