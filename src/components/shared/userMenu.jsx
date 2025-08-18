import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Box,
  Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Logout from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, logout } from '../../store/auth/auth';
import { useNavigate } from 'react-router-dom';
import { employeeRole } from '../../utils/selectDatas/employeeDatas';

const UserMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const { me_info, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!me_info?.role && isAuthenticated === 'success') {
      dispatch(getProfile());
    }
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Tooltip>
      <Box>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2, borderRadius: 2 }}
        >
          {me_info?.image ? (
            <Avatar alt={me_info?.first_name} src={me_info?.image} />
          ) : (
            <Avatar>{me_info?.first_name?.[0]}</Avatar>
          )}
          <KeyboardArrowDownIcon sx={{ ml: 1 }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 0.3,
              borderRadius: 2,
              minWidth: 250,
              p: 1,
              '& .MuiMenuItem-root': {
                borderRadius: 1,
              },
            },
          }}
        >
          <Box px={1} py={0.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              {me_info?.image ? (
                <Avatar alt={me_info?.first_name} src={me_info?.image} />
              ) : (
                <Avatar>{me_info?.first_name?.[0]}</Avatar>
              )}
              <Box>
                <Typography fontSize={14} fontWeight={600}>
                  {me_info?.user?.username}
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  {me_info?.name} {me_info?.surname}
                </Typography>
              </Box>
            </Box>

            <Box mt={1.5}>
              <Typography fontSize={14} mt={0.5} color="text.secondary">
                Роль: <strong>{employeeRole[me_info?.role].label}</strong>
              </Typography>
              {
                me_info?.rank?.title &&
                <Typography fontSize={14} mt={0.5} color="text.secondary">
                  Разряд: <strong>{me_info?.rank?.title}</strong>
                </Typography>
              }
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <Typography fontSize={14}>Выйти</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Tooltip>
  );
};

export default UserMenu;
