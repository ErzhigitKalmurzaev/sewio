import React from 'react'
import UserMenu from '../shared/userMenu'
import logo from '../../assets/images/smLogo.png'

const Header = () => {
  return (
    <div className='w-full h-[55px] border border-gray flex justify-between items-center px-5 shadow'>
      <div className='flex items-center gap-x-2'>
        <img src={logo} alt="logo" className='w-[35px] h-[35px] rounded-lg'/>
        <h1 className='text-2xl font-bold text-primary'>SewMaster</h1>
      </div>
      <UserMenu/>
    </div>
  )
}

export default Header
