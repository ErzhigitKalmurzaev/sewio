import React, { Suspense } from 'react'
import Header from '../../components/common/header'
import Navbar from '../../components/common/navbar'
import BackDrop from '../../components/ui/backdrop'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MobileNavbar from '../../components/common/mobileNavbar'

const ForemanTabletLayout = () => {

  const { me_info } = useSelector((state) => state.auth);

  return (
    <div className='w-full min-h-[100vh] flex flex-col'>
        <Header/>
        <div className='p-4 w-full' style={{ background: "#F5F5FA"}}>
            <Suspense fallback={<BackDrop />}>
                <Outlet />
            </Suspense>
        </div>
    </div>
  )
}

export default ForemanTabletLayout
