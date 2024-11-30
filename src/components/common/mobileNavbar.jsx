import React from 'react'
import { shveyaNav } from '../../utils/navDatas/navDatas'
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const MobileNavbar = () => {

  const navigate = useNavigate();

  const { pathname } = useLocation();
  const active = pathname.split("/")[2];

  return (
    <div className='w-full h-[60px] border border-gray flex justify-evenly items-center'>
        {
            shveyaNav.map(item => (
                <Tooltip className={`w-[50px] h-[46px] pointer border border-primary flex items-center px-5 rounded-lg ${active === item.path ? 'bg-primary' : 'bg-white'}`}> 
                    <div onClick={() => navigate(item.path)} className='flex flex-col justify-center gap-x-3 cursor-pointer' style={{ textDecoration: 'none', color: active === item.path ? 'white' : 'black', "&:hover": { textDecoration: 'none', color: active === item.path ? 'white' : 'black' } }}>
                        <span className={`w-[30px] h-[30px] flex justify-center items-center ${active === item.path ? 'text-white' : 'text-primary'}`}>
                            {item.icon}
                        </span>
                    </div>
                </Tooltip>
            ))
        }
    </div>
  )
}

export default MobileNavbar
