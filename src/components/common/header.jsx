import React from 'react'
import UserMenu from '../shared/userMenu'

const Header = () => {
  return (
    <div className='w-full h-[55px] border border-gray flex justify-between items-center px-5 shadow'>
      <h1 className='text-2xl font-bold'>SEWIO</h1>
      <UserMenu/>
    </div>
  )
}

export default Header
