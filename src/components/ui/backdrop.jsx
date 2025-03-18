import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

const BackDrop = ({ open = true }) => { // Деструктурируем open
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={Boolean(open)} // Принудительно делаем boolean (на всякий случай)
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default BackDrop;
