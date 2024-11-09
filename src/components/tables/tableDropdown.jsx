import React from 'react';
import { Popover, Whisper } from 'rsuite';
import { ReactComponent as Sort } from '../../assets/icons/sort.svg';

const TablePopover = ({ title, data, labelKey = 'label', handleChangeFilter, name, urls }) => {

    const renderPopover = () => (
        <Popover>
            {
                data?.map((item, index) => (
                    <div key={index} className="py-2 px-3 cursor-pointer hover:bg-gray" onClick={() => handleChangeFilter(name, item.value)}>
                        <p>{item[labelKey]}</p>
                    </div>
                ))
            }
        </Popover>
    );

    return (
        <Whisper
            trigger="click"
            placement="bottomStart"
            controlId="control-id-container"
            speaker={renderPopover()}
        >
            <div className='flex items-center gap-1 cursor-pointer'>
                {title}
                <Sort />
            </div>
        </Whisper>
    );
};

export default TablePopover;
