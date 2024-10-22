import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

const BackDrop = () => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={open}
            onClick={handleClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default BackDrop
