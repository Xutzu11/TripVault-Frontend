import {AccountCircle, DensitySmall, ShoppingCart} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Tooltip,
} from '@mui/material';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import CartMenu from './CartMenu';
import NavButton from './NavButton';
import UserMenu from './UserMenu';

const TopNavBar = () => {
    const nav = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElCart, setAnchorElCart] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCartClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElCart(event.currentTarget);
    };

    const handleCloseCart = () => {
        setAnchorElCart(null);
    };

    const navItems = [
        {label: 'Map', route: '/map'},
        {label: 'Attractions', route: '/attractions'},
        {label: 'Events', route: '/events'},
        {label: 'Validator', route: '/validate'},
    ];

    return (
        <AppBar position='sticky'>
            <Container maxWidth={false}>
                <Toolbar disableGutters sx={{justifyContent: 'space-between'}}>
                    {/* Left side: Logo + Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                        }}
                    >
                        <Box
                            component='img'
                            sx={{height: 50, mr: 2}}
                            alt='Museum Logo'
                            src='https://storage.googleapis.com/tripvault/logo.png'
                        />

                        {/* Mobile Menu Button */}
                        <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size='large'
                                edge='start'
                                color='inherit'
                                onClick={() => setDrawerOpen(true)}
                            >
                                <DensitySmall />
                            </IconButton>
                        </Box>

                        {/* Desktop Nav */}
                        <Box
                            sx={{
                                display: {xs: 'none', md: 'flex'},
                                gap: 2,
                            }}
                        >
                            {navItems.map((item) => (
                                <NavButton
                                    key={item.label}
                                    label={item.label}
                                    navigation={item.route}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Right side: Cart + User */}
                    <Box
                        sx={{
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

            {/* Mobile Drawer */}
            <Drawer
                anchor='left'
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box
                    sx={{width: 250}}
                    role='presentation'
                    onClick={() => setDrawerOpen(false)}
                >
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton onClick={() => nav(item.route)}>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
};

export default TopNavBar;
