import React, { useState } from 'react';
import { Popover, Whisper } from 'rsuite';
import { ReactComponent as Sort } from '../../assets/icons/sort.svg';

const TablePopover = ({ title, data, labelKey = 'label', handleChangeFilter, name }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (value) => {
        handleChangeFilter(name, value);
        setOpen(false); // Закрываем Popover после выбора
    };

    const renderPopover = () => (
        <Popover>
            {data?.map((item, index) => (
                <div
                    key={index}
                    className="py-2 px-3 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelect(item.value)}
                >
                    <p>{item[labelKey]}</p>
                </div>
            ))}
        </Popover>
    );

    return (
        <Whisper
            trigger="click"
            placement="bottomStart"
            open={open}
            onOpenChange={setOpen} // Управляем открытием/закрытием
            speaker={renderPopover()}
        >
            <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)} // Переключаем состояние при клике
            >
                {title}
                <Sort />
            </div>
        </Whisper>
    );
};

export default TablePopover;
