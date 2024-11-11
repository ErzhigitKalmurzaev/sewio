import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../store/auth/auth';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {

    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const { me_info } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProfile());
    }, [])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        localStorage.removeItem('sewio_token');
        navigate('/')
    };
    
  return (
    <div>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2, borderRadius: 5 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {
                me_info?.image ? 
                    <Avatar alt={me_info?.first_name} src={me_info?.image}/>
                        :
                    <Avatar sx={{ width: 32, height: 32 }}>{me_info?.first_name?.length > 0 ? me_info?.first_name[0] : ''}</Avatar>
            }
            <KeyboardArrowDownIcon sx={{ ml: 1 }}/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
            paper: {
                elevation: 0,
                sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                },
                '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                },
                },
            },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={handleClose}>
                <div className='flex flex-col gap-y-4'>
                    <div className='flex items-center gap-x-2'>
                        {
                            me_info?.image ? 
                                <Avatar size='lg' alt={me_info?.first_name} src={me_info?.image}/>
                                    :
                                <Avatar size='md'>{me_info?.first_name?.length > 0 ? me_info?.first_name[0] : ''}</Avatar>
                        }
                        <div className='flex flex-col gap-y-0'>
                            <p className='text-sm font-semibold font-inter leading-3'>{me_info?.user?.username}</p>
                            <p className='text-sm font-inter leading-3'>{me_info?.name + ' ' + me_info?.surname}</p>
                        </div>
                    </div>
                    <div>
                        <p className='text-[13px] font-inter'>Уровень: {me_info?.rank?.title}</p>
                        <p className='text-[13px] font-inter'>Телефон: {me_info?.phone}</p>
                        <p className='text-[13px] font-inter'>Email: {me_info?.email}</p>
                    </div>
                </div>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Выйти
            </MenuItem>
        </Menu>
        </Tooltip>
    </div>
  )
}

export default UserMenu
