import { Link, Tooltip } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavAccordion = ({ title, icon, active, hide, buttons }) => {

    const navigate = useNavigate();

    const getInitialHideState = () => {
        const savedHideDirectory = localStorage.getItem('directory-hide');
        return savedHideDirectory ? JSON.parse(savedHideDirectory) : false;
    };

    const [hideDirectory, setHideDirectory] = useState(getInitialHideState);

    useEffect(() => {
        localStorage.setItem('directory-hide', JSON.stringify(hideDirectory));
    }, [hideDirectory]);

    return (
        <div className='flex flex-col'>
            <Tooltip className={`${hide ? 'w-[60px]' : 'w-[210px]'} h-[46px] pointer flex items-center px-5 rounded-lg transition-all ease-linear duration-300`}>
                <div onClick={() => setHideDirectory(!hideDirectory)} className='flex items-center gap-x-3' style={{ textDecoration: 'none', cursor: 'pointer', "&:hover": { textDecoration: 'none' } }}>
                    <span className={`w-[30px] h-[30px] flex justify-center items-center`}>
                        {icon}
                    </span>
                    <p className={`font-inter font-sm font-medium transition-all duration-300 ease-linear overflow-hidden ${hide ? 'opacity-0 max-h-0' : 'opacity-100 max-h-[100px]'}`}>
                        {title}
                    </p>
                    <ChevronDown style={{ marginLeft: '8px'}} className={`${hideDirectory ? 'rotate-180' : ''} transition-transform ease-out duration-300`} />
                </div>
            </Tooltip>
            <div
                className={`transition-all ease-in-out duration-300 ${hideDirectory ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                style={{ transform: hideDirectory ? 'translateY(0)' : 'translateY(-20px)' }}
            >
                <div className={`flex flex-col ${hide ? 'w-full' : 'w-4/5'} mx-auto my-2 gap-y-2`}>
                    {
                        buttons.map((item, index) => {
                            return (
                                <Tooltip key={index + 'nav'} className={`${hide ? 'w-[60px]' : 'w-[180px]'} h-[40px] pointer flex items-center px-5 rounded-lg ${active === item.path ? 'bg-primary' : 'bg-white'} transition-all ease-linear duration-300`}>
                                    <div onClick={() => navigate(item.path)} className='flex items-center gap-x-3 cursor-pointer' style={{ textDecoration: 'none', color: active === item.path ? 'white' : 'black', "&:hover": { textDecoration: 'none', color: active ? 'white' : 'black' } }}>
                                        <span className={`w-[30px] h-[30px] flex justify-center items-center ${active === item.path ? 'text-white' : 'text-primary'}`}>
                                            {item.icon}
                                        </span>
                                        <p className={`font-inter font-xl font-medium transition-all duration-300 ease-linear overflow-hidden ${hide ? 'opacity-0 max-h-0' : 'opacity-100 max-h-[100px]'}`}>
                                            {item.title}
                                        </p>
                                    </div>
                                </Tooltip>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default NavAccordion;
