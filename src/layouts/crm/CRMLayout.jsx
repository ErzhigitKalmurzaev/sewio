import React, { Suspense } from 'react'
import Header from '../../components/common/header'
import Navbar from '../../components/common/navbar'
import BackDrop from '../../components/ui/backdrop'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CRMLayout = () => {

  const { me_info } = useSelector((state) => state.auth);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Фиксированный Header */}
      <Header className="flex-shrink-0" />

      <div className="flex flex-1 overflow-hidden">
        {/* Фиксированный Navbar */}
        <Navbar role={me_info?.role} className="flex-shrink-0" />

        {/* Скролящаяся основная часть */}
        <div className="p-10 w-full overflow-auto" style={{ background: "#F5F5FA" }}>
          <Suspense fallback={<BackDrop />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default CRMLayout
