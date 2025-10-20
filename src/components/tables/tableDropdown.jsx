import React, { useState, useRef, useEffect } from 'react';
import { Popover, Whisper } from 'rsuite';
import { ReactComponent as Sort } from '../../assets/icons/sort.svg';

const TableDropdown = ({ title, data, labelKey = 'label', handleChangeFilter, name, urls }) => {
    const [open, setOpen] = useState(false);
    const whisperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Проверяем, что клик был вне поповера
            const popoverElement = document.querySelector('.rs-popover');
            const triggerElement = whisperRef.current?.root;
            
            if (
                open &&
                popoverElement &&
                !popoverElement.contains(event.target) &&
                triggerElement &&
                !triggerElement.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            // Добавляем слушатель с небольшой задержкой, чтобы не перехватить текущий клик
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const handleSelect = (value) => {
        handleChangeFilter(name, value);
        setOpen(false);
    };

    const renderPopover = () => (
        <Popover className="!p-0 !shadow-lg !border-gray-200">
            <div className="py-2 min-w-[140px]">
                {data?.map((item, index) => (
                    <div
                        key={index}
                        className="py-2 px-3 cursor-pointer hover:bg-blue-50 transition-all duration-150 active:bg-blue-100"
                        onClick={() => handleSelect(item.value)}
                    >
                        <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{item[labelKey]}</p>
                    </div>
                ))}
            </div>
        </Popover>
    );

    return (
        <Whisper
            ref={whisperRef}
            trigger="none"
            placement="bottomStart"
            open={open}
            speaker={renderPopover()}
            preventOverflow
        >
            <div
                className="flex items-center gap-1.5 cursor-pointer select-none hover:text-blue-600 transition-colors group"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className="font-medium text-sm">{title}</span>
                <Sort className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
        </Whisper>
    );
};

export default TableDropdown;