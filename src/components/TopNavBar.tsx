import {AccountCircle, Remove, ShoppingCart} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

interface TopNavBarProps {
    name: string;
    cartItems: any[];
    onDeleteCartItem: (event_id: number) => void;
    calculateTotalPrice: (cart: any[]) => string;
}

const TopNavBar = ({
    name,
    cartItems,
    onDeleteCartItem,
    calculateTotalPrice,
}: TopNavBarProps) => {
    const nav = useNavigate();

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElCart, setAnchorElCart] = useState<null | HTMLElement>(null);

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

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('eventsCart');
        nav('/');
    };

    const toProfile = () => {
        nav('/profile');
    };

    const toMap = () => nav('/map');
    const toAdd = () => nav('/attractions/add');
    const toEvents = () => nav('/events');
    const toRevenue = () => nav('/revenue_chart');
    const toUsers = () => nav('/users');
    const toCart = () => nav('/cart');

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
                        alt='Logo'
                        src='https://i.ibb.co/1f1WgXs/logo.png'
                    />
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: {xs: 'none', md: 'flex'},
                            gap: 2,
                        }}
                    >
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={toMap}
                        >
                            Map
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={toAdd}
                        >
                            Add attraction
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={toEvents}
                        >
                            Events
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={toRevenue}
                        >
                            See revenue
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={toUsers}
                        >
                            Users
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography sx={{padding: 2}}>{name}</Typography>
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
                        <Menu
                            sx={{mt: '45px'}}
                            id='menu-appbar'
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleCloseUserMenu();
                                    toProfile();
                                }}
                            >
                                <Typography textAlign='center'>
                                    Profile
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleCloseUserMenu();
                                    logout();
                                }}
                            >
                                <Typography textAlign='center'>
                                    Logout
                                </Typography>
                            </MenuItem>
                        </Menu>
                        <Menu
                            sx={{mt: '45px'}}
                            id='menu-cart'
                            anchorEl={anchorElCart}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElCart)}
                            onClose={handleCloseCart}
                        >
                            <Box sx={{padding: 2, minWidth: 300}}>
                                <Typography variant='h6'>
                                    Shopping cart
                                </Typography>
                                {cartItems.length === 0 ? (
                                    <Typography>Your cart is empty.</Typography>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: 1,
                                            }}
                                        >
                                            <Typography>
                                                {item.event.name} (x
                                                {item.quantity})
                                            </Typography>
                                            <Typography>
                                                $
                                                {(
                                                    item.quantity *
                                                    item.event.price
                                                ).toFixed(2)}
                                            </Typography>
                                            <IconButton
                                                size='small'
                                                color='secondary'
                                                onClick={() =>
                                                    onDeleteCartItem(
                                                        item.event.id,
                                                    )
                                                }
                                            >
                                                <Remove />
                                            </IconButton>
                                        </Box>
                                    ))
                                )}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: 1,
                                        borderTop: '1px solid #ddd',
                                        marginTop: 1,
                                    }}
                                >
                                    <Typography variant='h6'>Total</Typography>
                                    <Typography variant='h6'>
                                        ${calculateTotalPrice(cartItems)}
                                    </Typography>
                                </Box>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    sx={{marginTop: 2, width: '100%'}}
                                    onClick={toCart}
                                >
                                    Go to Cart
                                </Button>
                            </Box>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default TopNavBar;
