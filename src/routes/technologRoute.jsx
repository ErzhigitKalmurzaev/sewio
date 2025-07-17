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
import Sklad from '../pages/technolog/warehouse/main'
import Discharge from '../pages/technolog/discharge/main'
import Equipments from '../pages/technolog/equipments/main'
import Clients from '../pages/technolog/clients/main'
import CreateClient from '../pages/technolog/clients/create/createClient'
import EditClient from '../pages/technolog/clients/edit/editClient'
import Sizes from '../pages/technolog/sizes/main'
import OrderEdit from '../pages/technolog/orders/orderEdit'
import CreateWarehouse from '../pages/technolog/warehouse/create/createWarehouse'
import EditWarehouse from '../pages/technolog/warehouse/edit/EditWarehouse'
import PaymentInfo from '../pages/technolog/employee/salary/paymentInfo'
import Calculator from '../pages/technolog/calculator/main'
import CreateEquipment from '../pages/technolog/equipments/create/createEquipment'
import EditEquipment from '../pages/technolog/equipments/edit/EditEquipment'
import CalcHistory from '../pages/technolog/calculator/history/calcHistory'
import EditCalculate from '../pages/technolog/calculator/editCalc/editCalculate'
import OperationDirectory from '../pages/technolog/operationsDirectory/main'
import EditProduct from '../pages/technolog/product/editProduct'
import CreateOrder from '../pages/technolog/calculator/toOrder/createOrder'

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
                  <Route path="salary_history/:salary_id" element={<PaymentInfo />} />
                  <Route path="salary_calculate" element={<SalaryPayment />} />
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
                <Route path=":id" element={<OrderEdit />} />
            </Route>
            
            <Route path="product" element={<Outlet />}>
                <Route path="" element={<Products />} />
                <Route path="create" element={<CreateProduct />} />
                <Route path=":id" element={<EditProduct/>}/>
            </Route>
            
            <Route path="sklad" element={<Outlet />}>
                <Route path="" element={<Sklad />} />
                <Route path="create" element={<CreateWarehouse />} />
                <Route path=":id" element={<EditWarehouse />} />
            </Route>

            <Route path="operations" element={<Outlet/>}>
                <Route path="" element={<OperationDirectory />} />
            </Route>
            
            <Route path="equipments" element={<Outlet/>}>
                <Route path="" element={<Equipments />} />
                <Route path="create" element={<CreateEquipment />} />    
                <Route path=":id" element={<EditEquipment />} />    
            </Route>
            
            <Route path="discharge" element={<Discharge />} />
            <Route path="sizes" element={<Sizes />} />
            <Route path="knowledge" element={<p>База знаний</p>} />
            <Route path="calculator" element={<Outlet/>}>
                <Route path="" element={<Calculator />} />
                <Route path="history" element={<CalcHistory />} />
                <Route path=':id' element={<EditCalculate/>}/>
                <Route path="order/:id" element={<CreateOrder />} />
            </Route>
        </Route>
    </Routes>
  )
}

export default TechnologRoute