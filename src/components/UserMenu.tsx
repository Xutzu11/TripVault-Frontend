import {Menu, MenuItem, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

interface UserMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
}

const UserMenu = ({anchorEl, open, onClose}: UserMenuProps) => {
    const nav = useNavigate();

    // Go to profile page
    const onProfile = () => {
        nav('/profile');
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('eventsCart');
        nav('/');
    };

    return (
        <Menu
            sx={{mt: '45px'}}
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            onClose={onClose}
        >
            <MenuItem
                onClick={() => {
                    onClose();
                    onProfile();
                }}
            >
                <Typography textAlign='center'>Profile</Typography>
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onClose();
                    logout();
                }}
            >
                <Typography textAlign='center'>Logout</Typography>
            </MenuItem>
        </Menu>
    );
};

export default UserMenu;
