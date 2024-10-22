import React, { Suspense } from 'react'
import Header from '../../components/common/header'
import Navbar from '../../components/common/navbar'
import BackDrop from '../../components/ui/backdrop'
import { Outlet } from 'react-router-dom'

const CRMLayout = () => {
  return (
    <div className='w-full min-h-[100vh] flex flex-col'>
        <Header/>
        <div className='flex'>
            <Navbar/>
            <div className='p-10 w-full' style={{ background: "#F5F5FA"}}>
                <Suspense fallback={<BackDrop />}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    </div>
  )
}

export default CRMLayout
