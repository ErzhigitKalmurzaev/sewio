import { Tooltip } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavAccordion = ({ title, icon, active, hide, buttons }) => {
    const navigate = useNavigate();

    // Создаем уникальный ключ для localStorage на основе title
    const storageKey = `directory-hide-${title}`;

    const getInitialHideState = () => {
        const savedHideDirectory = localStorage.getItem(storageKey);
        return savedHideDirectory ? JSON.parse(savedHideDirectory) : false;
    };

    const [hideDirectory, setHideDirectory] = useState(getInitialHideState);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(hideDirectory));
    }, [hideDirectory, storageKey]);

    const handleToggleDirectory = () => {
        setHideDirectory(!hideDirectory);
    };

    const handleNavigate = (path) => {
        navigate(`${path}`);
    };

    return (
        <div className='flex flex-col'>
            {/* Заголовок аккордеона */}
            <div className={`${hide ? 'w-[60px]' : 'w-[210px]'} h-[46px] flex items-center px-5 rounded-lg transition-all ease-linear duration-300 hover:bg-slate-200 cursor-pointer`}>
                <Tooltip title={hide ? title : ''} placement="right">
                    <div 
                        onClick={handleToggleDirectory} 
                        className='flex items-center gap-x-3 w-full'
                    >
                        <span className='w-[30px] h-[30px] flex justify-center items-center flex-shrink-0'>
                            {icon}
                        </span>
                        {!hide && (
                            <>
                                <p className='font-inter text-sm font-medium flex-1 whitespace-nowrap overflow-hidden'>
                                    {title}
                                </p>
                                <ChevronDown 
                                    size={20}
                                    className={`${hideDirectory ? 'rotate-180' : ''} transition-transform ease-out duration-300 flex-shrink-0`} 
                                />
                            </>
                        )}
                    </div>
                </Tooltip>
            </div>

            {/* Содержимое аккордеона */}
            {!hide && (
                <div
                    className={`transition-all ease-in-out duration-300 overflow-hidden ${
                        hideDirectory 
                            ? 'max-h-[1000px] opacity-100' 
                            : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className='flex flex-col w-4/5 mx-auto my-2 gap-y-1'>
                        {buttons.map((item, index) => {
                            const isActive = active === item.path;
                            
                            return (
                                <Tooltip 
                                    key={`${item.path}-${index}`} 
                                    title={hide ? item.title : ''} 
                                    placement="right"
                                >
                                    <div 
                                        onClick={() => handleNavigate(item.path)}
                                        className={`w-[180px] h-[44px] flex items-center px-5 rounded-lg cursor-pointer transition-all ease-linear duration-300 ${
                                            isActive 
                                                ? 'bg-primary text-white' 
                                                : 'bg-white hover:bg-slate-200 text-black'
                                        }`}
                                    >
                                        <span className={`w-[30px] h-[30px] flex justify-center items-center flex-shrink-0 ${
                                            isActive ? 'text-white' : 'text-primary'
                                        }`}>
                                            {item.icon}
                                        </span>
                                        <p className='font-inter text-sm font-medium ml-2 whitespace-nowrap overflow-hidden'>
                                            {item.title}
                                        </p>
                                    </div>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavAccordion;