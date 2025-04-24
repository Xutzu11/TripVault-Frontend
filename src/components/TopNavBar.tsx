import {AccountCircle, ShoppingCart} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Container,
    IconButton,
    Toolbar,
    Tooltip,
} from '@mui/material';
import {useState} from 'react';
import CartMenu from './CartMenu';
import NavButton from './NavButton';
import UserMenu from './UserMenu';

const TopNavBar = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElCart, setAnchorElCart] = useState<null | HTMLElement>(null);

    // Open user menu
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    // Close user menu
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Open cart menu
    const handleCartClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElCart(event.currentTarget);
    };

    // Close cart menu
    const handleCloseCart = () => {
        setAnchorElCart(null);
    };

    return (
        <AppBar position='sticky'>
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <Box
                        component='img'
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            height: 50,
                        }}
                        alt='Museum Logo'
                        src='https://storage.googleapis.com/tripvault/logo.png'
                    />
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: {xs: 'none', md: 'flex'},
                            gap: 2,
                        }}
                    >
                        <NavButton label='Map' navigation='/map' />
                        <NavButton
                            label='Attractions'
                            navigation='/attractions'
                        />
                        <NavButton label='Events' navigation='/events' />
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Tooltip title='Open cart'>
                            <IconButton onClick={handleCartClick} sx={{p: 0}}>
                                <ShoppingCart sx={{fontSize: '40px'}} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Open settings'>
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{p: 0}}
                            >
                                <AccountCircle sx={{fontSize: '40px'}} />
                            </IconButton>
                        </Tooltip>
                        <CartMenu
                            anchorEl={anchorElCart}
                            open={Boolean(anchorElCart)}
                            onClose={handleCloseCart}
                        />
                        <UserMenu
                            anchorEl={anchorElUser}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default TopNavBar;
