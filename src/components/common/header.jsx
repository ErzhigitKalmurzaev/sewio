import React from 'react'
import UserMenu from '../shared/userMenu'
import logo from '../../assets/images/tunduk.png'

const Header = () => {
  return (
    <div className='w-full h-[55px] border border-gray flex justify-between items-center px-5 shadow'>
      <div className='flex items-center gap-x-2'>
        <img src={logo} alt="logo" className='w-[45px] h-[45px] rounded-lg object-contain'/>
        <div className='flex flex-col gap-y-0 justify-center'>
          <h1 className='m-0 text-2xl font-[750] font-inter text-primary text-[#3DA9FC]'>Uni<span className='text-[#5C6B73]'>Soft</span></h1>
          <p className='m-0 leading-none text-sm font-semibold font-inter text-fprimary'>Software development</p>
        </div>
      </div>
      <UserMenu/>
    </div>
  )
}

export default Header
