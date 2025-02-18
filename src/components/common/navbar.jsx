import React, { useEffect, useState } from 'react'
import { shveyaNav, technologNav, warehouseNav } from '../../utils/navDatas/navDatas'
import NavButton from '../shared/navButton'
import { useLocation } from 'react-router-dom';

import { ChevronLeft } from 'lucide-react';
import NavAccardion from '../shared/navAccardion';

const Navbar = ({ role }) => {

    const { pathname } = useLocation();
    const active = pathname.split("/")[2];

    const getInitialHideState = () => {
        const savedHideState = localStorage.getItem('navbar-hide');
        return savedHideState ? JSON.parse(savedHideState) : false;
    };

    const [hide, setHide] = useState(getInitialHideState);

    useEffect(() => {
        localStorage.setItem('navbar-hide', JSON.stringify(hide));
    }, [hide]);

    const navs = [
        technologNav,
        technologNav,
        technologNav,
        warehouseNav,
        shveyaNav
    ]

    return (
        <div className={`${hide ? 'w-[80px]' : 'w-[270px]'} h-[100vh] relative border-r border-gray flex flex-col items-center gap-1 py-8 transition-all ease-linear duration-300`}>
            {
                navs[role].map((item, index) => {
                    return (
                        item.elements ? 
                            <NavAccardion key={index} title={item.title} icon={item.icon} active={active} hide={hide} buttons={item.buttons} />
                            :
                            <NavButton key={index} title={item.title} path={item.path} icon={item.icon} active={active === item.path} hide={hide}/>
                    )
                })
            }
            <button className='absolute top-1 right-[-16px] border bg-white rounded-full w-[32px] h-[32px] bg-white hover:drop-shadow-2xl' onClick={() => setHide(!hide)}>
                <ChevronLeft size={28} color='#2F4F4F' className={`${hide ? 'rotate-180' : ''} transition-transform ease-out duration-300`} />
            </button>
        </div>
    )
}

export default Navbar
