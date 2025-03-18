import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import BackDrop from '../components/ui/backdrop';

// Ленивая загрузка компонентов
const CRMLayout = lazy(() => import('../layouts/crm/CRMLayout'));
const Statistic = lazy(() => import('../pages/technolog/statistic/main'));
const Employee = lazy(() => import('../pages/technolog/employee/main'));
const CreateEmployee = lazy(() => import('../pages/technolog/employee/create/createEmployee'));
const EditEmployee = lazy(() => import('../pages/technolog/employee/editEmployee'));
const SalaryHistory = lazy(() => import('../pages/technolog/employee/salary/salaryHistory'));
const SalaryPayment = lazy(() => import('../pages/technolog/employee/salary/salaryPayment'));
const Products = lazy(() => import('../pages/technolog/product/main'));
const CreateProduct = lazy(() => import('../pages/technolog/product/createProduct'));
const Orders = lazy(() => import('../pages/technolog/orders/main'));
const OrderCreate = lazy(() => import('../pages/technolog/orders/orderCreate'));
const Sklad = lazy(() => import('../pages/technolog/warehouse/main'));
const Discharge = lazy(() => import('../pages/technolog/discharge/main'));
const Equipments = lazy(() => import('../pages/technolog/equipments/main'));
const Clients = lazy(() => import('../pages/technolog/clients/main'));
const CreateClient = lazy(() => import('../pages/technolog/clients/create/createClient'));
const EditClient = lazy(() => import('../pages/technolog/clients/edit/editClient'));
const Sizes = lazy(() => import('../pages/technolog/sizes/main'));
const OrderEdit = lazy(() => import('../pages/technolog/orders/orderEdit'));
const CreateWarehouse = lazy(() => import('../pages/technolog/warehouse/create/createWarehouse'));
const EditWarehouse = lazy(() => import('../pages/technolog/warehouse/edit/EditWarehouse'));
const PaymentInfo = lazy(() => import('../pages/technolog/employee/salary/paymentInfo'));
const Calculator = lazy(() => import('../pages/technolog/calculator/main'));
const CreateEquipment = lazy(() => import('../pages/technolog/equipments/create/createEquipment'));
const EditEquipment = lazy(() => import('../pages/technolog/equipments/edit/EditEquipment'));
const CalcHistory = lazy(() => import('../pages/technolog/calculator/history/calcHistory'));
const EditCalculate = lazy(() => import('../pages/technolog/calculator/editCalc/editCalculate'));
const OperationDirectory = lazy(() => import('../pages/technolog/operationsDirectory/main'));
const EditProduct = lazy(() => import('../pages/technolog/product/editProduct'));
const CreateOrder = lazy(() => import('../pages/technolog/calculator/toOrder/createOrder'));

const TechnologRoute = () => {
  return (
    <Suspense fallback={<BackDrop/>}>
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
              <Route path="salary_history/:id" element={<PaymentInfo />} />
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
            <Route path=":id" element={<EditProduct />} />
          </Route>

          <Route path="sklad" element={<Outlet />}>
            <Route path="" element={<Sklad />} />
            <Route path="create" element={<CreateWarehouse />} />
            <Route path=":id" element={<EditWarehouse />} />
          </Route>

          <Route path="operations" element={<Outlet />}>
            <Route path="" element={<OperationDirectory />} />
          </Route>

          <Route path="equipments" element={<Outlet />}>
            <Route path="" element={<Equipments />} />
            <Route path="create" element={<CreateEquipment />} />
            <Route path=":id" element={<EditEquipment />} />
          </Route>

          <Route path="discharge" element={<Discharge />} />
          <Route path="sizes" element={<Sizes />} />
          <Route path="knowledge" element={<p>База знаний</p>} />
          <Route path="calculator" element={<Outlet />}>
            <Route path="" element={<Calculator />} />
            <Route path="history" element={<CalcHistory />} />
            <Route path=":id" element={<EditCalculate />} />
            <Route path="order/:id" element={<CreateOrder />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default TechnologRoute;
