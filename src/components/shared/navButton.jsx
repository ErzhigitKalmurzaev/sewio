import { Accordion, Link, Tooltip, AccordionSummary, Typography, AccordionDetails } from '@mui/material'
import { ChevronDown } from 'lucide-react';

import React, { useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';

const NavButton = ({ title, path, icon, active, hide }) => {

  const navigate = useNavigate();

  return (
    <Tooltip className={`${hide ? 'w-[60px]' : 'w-[210px]'} h-[46px] pointer flex items-center px-5 rounded-lg ${active ? 'bg-primary' : 'bg-white'} transition-all ease-linear duration-300`}> 
      <div onClick={() => navigate(path)} className='flex items-center gap-x-3 cursor-pointer' style={{ textDecoration: 'none', color: active ? 'white' : 'black', "&:hover": { textDecoration: 'none', color: active ? 'white' : 'black' } }}>
          <span className={`w-[30px] h-[30px] flex justify-center items-center ${active ? 'text-white' : 'text-primary'}`}>
              {icon}
          </span>
          <p className={`font-inter font-xl font-medium transition-all duration-300 ease-linear overflow-hidden ${hide ? 'opacity-0 max-h-0' : 'opacity-100 max-h-[100px]'}`}>
              {title}
          </p>
      </div>
    </Tooltip>

  )
}

export default NavButton
