import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { debounce } from 'lodash';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import config from './config.json';
import { ThemeProvider, CssBaseline, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, Box, Stack, Pagination, TextField, Select, MenuItem, Slider, AppBar, Container, Toolbar, IconButton, Tooltip, Menu } from '@mui/material';
import { Rating } from '@mui/lab';
import theme from './theme';
import { AccountCircle, Email, LocationCity, MoreVert, Remove, ShoppingCart } from '@mui/icons-material';

function MuseumsPage() {
    const getOnLineStatus = () =>
        typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
            ? navigator.onLine
            : true;

    const useNavigatorOnLine = () => {
        const [status, setStatus] = useState(getOnLineStatus());
    
        const setOnline = () => setStatus(true);
        const setOffline = () => setStatus(false);
    
        useEffect(() => {
            window.addEventListener('online', setOnline);
            window.addEventListener('offline', setOffline);
    
            return () => {
                window.removeEventListener('online', setOnline);
                window.removeEventListener('offline', setOffline);
            };
        }, []);
    
        return status;
    };

    const isOnline = useNavigatorOnLine();

    const [status, setStatus] = useState(false);
    const [refetch, setRefetch] = useState(false);
    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                await axios.get(`${config.SERVER_URL}/api/status`);
                setStatus(true);
            } catch (error) {
                setStatus(false);
            }
        };
        checkServerStatus();
        const interval = setInterval(checkServerStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const nav = useNavigate();

    const [name, setName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    nav('/');
                    return;
                }

                const response = await axios.get(`${config.SERVER_URL}/api/access/user`, {
                    headers: {
                        Authorization: token
                    }
                });

                setName(response.data.fname);

            } catch (error) {
                nav('/');
            }
        };

        fetchData();
    }, []);

    const [access, setAccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                await axios.get(`${config.SERVER_URL}/api/access/user`, {
                    headers: {
                        Authorization: token
                    }
                });
                setAccess(true);

            } catch (error) {
                return;
            }
        };

        fetchData();
    }, []);

    const PAGE_MUSEUMS = 10;

    const [currentP, setCurrentP] = useState(1);
    const [museums, setMuseums] = useState([]);
    const [sortOpt, setSortOpt] = useState('');
    const [totalMuseums, setTotalMuseums] = useState(0);
    const socket = socketIOClient(`${config.SERVER_URL}`);
    const settings = ['Profile', 'Logout'];
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElCart, setAnchorElCart] = useState(null);
    const [refetchCart, setRefetchCart] = useState(false);

    const getCartItems = () => {
        const cart = JSON.parse(localStorage.getItem('exhibitionsCart') || '[]');
        return cart;
    };

    const [cartItems, setCartItems] = useState(getCartItems());

    const handleCartClick = (event) => {
        setAnchorElCart(event.currentTarget);
    };
    
    const handleCloseCart = () => {
        setAnchorElCart(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    
    const calculateTotalPrice = (cart) => {
        return cart.reduce((total, item) => total + (item.quantity * item.exhibition.price), 0).toFixed(2);
    };
    
    /// infinite scrolling, not used anymore
    /*const debouncedHandleScroll = debounce((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const position = Math.ceil((scrollTop / (scrollHeight - clientHeight)) * 100);
        if (position >= 100 && currentP * PAGE_MUSEUMS === museums.length) {
            fetchMore();
        }
    }, 100);
    
    const handleScroll = (e) => {
        debouncedHandleScroll(e);
    };*/

    useEffect(() => {
            socket.on("museumsChange", (museums) => {
                setMuseums(museums);
            });
        } 
    , []);

    useEffect(() => {
        axios.get(`${config.SERVER_URL}/api/museums/filtered/from/${(currentP-1)*PAGE_MUSEUMS+1}/to/${currentP*PAGE_MUSEUMS}`,
            {
                params: {
                    sortopt: sortOpt,
                    name: filters.name,
                    theme: filters.theme,
                    minrev: filters.revenueRange[0],
                    maxrev: filters.revenueRange[1],
                    country: filters.country,
                    state: filters.state,
                    city: filters.city,
                    minrating: filters.rating 
                },
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
            .then(function (response) {
                console.log(response.data);
                setMuseums(response.data);
            })
            .catch(function () {
                const syncMuseums = localStorage.getItem("museums") || "[]";
                const parsedSyncMuseums = JSON.parse(syncMuseums);
                setMuseums(parsedSyncMuseums);
            });

        axios.get(`${config.SERVER_URL}/api/museums/filtered/count`, {
                params: { 
                    name: filters.name,
                    theme: filters.theme,
                    minrev: filters.revenueRange[0],
                    maxrev: filters.revenueRange[1],
                    country: filters.country,
                    state: filters.state,
                    city: filters.city,
                    minrating: filters.rating 
                },
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
            .then(function (response) {
                setTotalMuseums(response.data);
            })
            .catch(function () {
                const syncMuseums = localStorage.getItem("museums") || "[]";
                const parsedSyncMuseums = JSON.parse(syncMuseums);
                setTotalMuseums(parsedSyncMuseums.length);
            });

        setRefetch(false);
    }, [currentP, refetch]);


    useEffect(() => {
        if (status && isOnline) {
            const syncMuseums = localStorage.getItem("museums") || "[]";
            const parsedSyncMuseums = JSON.parse(syncMuseums);
            parsedSyncMuseums.forEach((museum) => {
                axios.post(`${config.SERVER_URL}/api/museum/add`, museum,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        }
                    }
                )
                    .then(function () {})
                    .catch(function () {});
            });
            localStorage.setItem("museums", JSON.stringify([]));
        }
        setCurrentP(1);
        setRefetch(true);
    }, [status, isOnline]);

    const handleDeleteMuseumItem = (museumID) => {
        if (!access) {
            window.alert('You must have admin rights in order to delete.');
            return;
        }
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this museum?',
        );
        if (!confirmDelete) return;
        axios.delete(`${config.SERVER_URL}/api/museum/delete/${museumID}`,
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            }
        )
            .then(function (response) {
                console.log(response)
                setMuseums(prevMuseums => prevMuseums.filter(museum => museum.mid !== museumID));
                window.alert("Museum deleted.");
            }).catch(function (error) {
                const syncMuseums = localStorage.getItem("museums") || "[]";
                const parsedSyncMuseums = JSON.parse(syncMuseums);
                localStorage.setItem("museums", JSON.stringify(parsedSyncMuseums.filter((museum) => (museum.mid !== museumID))));
                window.alert("Delete failed: " + error.response.data);
        });
    };

    useEffect(() => {
        setCartItems(getCartItems());
        setRefetchCart(false);
    }, [refetchCart]); 

    const toAdd = () => {
        nav(`/museums/add`);
    };

    const toEdit = (museumID) => {
        nav(`/museums/` + String(museumID));
    };

    const toSort = (event) => {
        setSortOpt(event.target.value);
    };

    const toRevenue = () => {
        nav(`/revenue_chart`);
    };

    const toExhibitions = () => {
        nav('/exhibitions');
    };

    const toExhibitionsMuseum = (museumID) => {
        nav('/exhibitions-museum/' + String(museumID));
    };

    const toProfile = () => {
        nav('/profile');
    };

    const toUsers = () => {
        nav('/users');
    };

    const toMap = () => {
        nav('/map');
    };

    const toCart = () => {
        nav('/cart');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('exhibitionsCart');
        nav('/');
    };

    useEffect(() => {
        setRefetch(true);
    }, [sortOpt]);
    
    const handlePageChange = (event, value) => {
        setCurrentP(value);
    };

    useEffect(() => {
        setMuseums([]);
    }, []);

    const [filters, setFilters] = useState({
        name: '',
        theme: '',
        revenueRange: [0, 1000000000],
        country: 0,
        state: 0,
        city: 0,
        rating: 0,
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get(`${config.SERVER_URL}/api/countries`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        })
            .then(response => setCountries(response.data))
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    useEffect(() => {
        if (filters.country) {
            axios.get(`${config.SERVER_URL}/api/states`, {
                params: { country: filters.country },
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
                .then(response => setStates(response.data))
                .catch(error => console.error('Error fetching states:', error));
        } else {
            setStates([]);
            setCities([]);
        }
    }, [filters.country]);

    useEffect(() => {
        if (filters.state) {
            axios.get(`${config.SERVER_URL}/api/cities`, {
                params: { state: filters.state },
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
                .then(response => setCities(response.data))
                .catch(error => console.error('Error fetching cities:', error));
        } else {
            setCities([]);
        }
    }, [filters.state]);

    const handleFilterChange = (filterName, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const applyFilters = () => {
        setCurrentP(1);
        setRefetch(true);
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            theme: '',
            revenueRange: [0, 1000000000],
            country: 0,
            state: 0,
            city: 0,
            rating: 0,
        });
        setStates([]);
        setCities([]);
        setCurrentP(1);
        setRefetch(true);
    };
    
    const handleDeleteCartItem = (exhibitionID) => {
        const cart = JSON.parse(localStorage.getItem('exhibitionsCart') || '[]');
        const index = cart.findIndex(item => item.exhibition.id === exhibitionID);
    
        if (index !== -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            localStorage.setItem('exhibitionsCart', JSON.stringify(cart));
            setRefetchCart(true);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="sticky">
                <Container maxWidth={false}>
                    <Toolbar disableGutters>
                        <Box
                            component="img"
                            sx={{ 
                                mr: 2, 
                                display: { xs: 'none', md: 'flex' },
                                height: 50
                            }}
                            alt="Logo"
                            src="https://i.ibb.co/1f1WgXs/logo.png"
                        />

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                            <Button variant="contained" color="primary" onClick={toMap}>Map</Button>
                            <Button variant="contained" color="primary" onClick={toAdd}>Add museum</Button>
                            <Button variant="contained" color="primary" onClick={toExhibitions}>Exhibitions</Button>
                            <Button variant="contained" color="primary" onClick={toRevenue}>See revenue</Button>
                            <Button variant="contained" color="primary" onClick={toUsers}>Users</Button>
                        </Box>

                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{padding: 2, display: "inline-block"}}>{name}</Typography>
                            <Tooltip title="Open cart">
                                <IconButton onClick={handleCartClick} sx={{ p: 0 }}>
                                    <ShoppingCart sx={{ fontSize: '40px' }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <AccountCircle sx={{fontSize: '40px'}}/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
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
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center" onClick={setting === 'Profile' ? toProfile : logout}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-cart"
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
                                <Box sx={{ padding: 2, minWidth: 300 }}>
                                    <Typography variant="h6">Shopping cart</Typography>
                                    {cartItems.length === 0 ? (<Typography>Your cart is empty.</Typography>) : 
                                    (cartItems.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
                                            <Typography>{item.exhibition.name} (x{item.quantity})</Typography>
                                            <Typography>${(item.quantity * item.exhibition.price).toFixed(2)}</Typography>
                                            <IconButton size="small" color="secondary" onClick={() => handleDeleteCartItem(item.exhibition.id)}>
                                                <Remove />
                                            </IconButton>
                                        </Box>
                                    )))}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1, borderTop: '1px solid #ddd', marginTop: 1 }}>
                                        <Typography variant="h6">Total</Typography>
                                        <Typography variant="h6">${calculateTotalPrice(cartItems)}</Typography>
                                    </Box>
                                    <Button variant="contained" color="primary" sx={{ marginTop: 2, width: '100%' }} onClick={toCart}>Go to Cart</Button>
                                </Box>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box sx={{
                padding: 3,
                background: 'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040, #ad9267)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}>
                <Typography variant="subtitle1" align="center" color="error">{status ? '' : 'Server is offline.'}</Typography>
                <Typography variant="subtitle1" align="center" color="error">{isOnline ? '' : 'Network is unavailable.'}</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                        <Card sx={{ padding: 2 }}>
                            <Typography variant="h6">Filters</Typography>
                            <Box sx={{ marginTop: 2 }}>
                                <TextField sx={{ marginTop: 2 }}
                                    label="Name"
                                    type="text"
                                    value={filters.name}
                                    onChange={(e) => handleFilterChange('name', e.target.value)}
                                    fullWidth
                                />
                                <TextField sx={{ marginTop: 2 }}
                                    label="Theme"
                                    type="text"
                                    value={filters.theme}
                                    onChange={(e) => handleFilterChange('theme', e.target.value)}
                                    fullWidth
                                />
                                <Typography variant="body1" sx={{ marginTop: 2 }}>Revenue</Typography>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginTop: 1 }}>
                                    <TextField
                                        label="Min"
                                        type="number"
                                        value={filters.revenueRange[0]}
                                        onChange={(e) => handleFilterChange('revenueRange', [Number(e.target.value), filters.revenueRange[1]])}
                                        InputProps={{ inputProps: { min: 0, max: 1000000000, step: 1000000 } }}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Max"
                                        type="number"
                                        value={filters.revenueRange[1]}
                                        onChange={(e) => handleFilterChange('revenueRange', [filters.revenueRange[0], Number(e.target.value)])}
                                        InputProps={{ inputProps: { min: 0, max: 1000000000, step: 1000000 } }}
                                        fullWidth
                                    />
                                </Box>
                                <Typography variant="body1" sx={{ marginTop: 2 }}>Country</Typography>
                                <Select
                                    fullWidth
                                    value={filters.country}
                                    onChange={(e) => handleFilterChange('country', e.target.value)}
                                >
                                    {countries.map((country) => (
                                        <MenuItem key={country.id} value={country.id}>
                                            {country.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {filters.country != 0 && (
                                    <>
                                        <Typography variant="body1" sx={{ marginTop: 2 }}>State</Typography>
                                        <Select
                                            fullWidth
                                            value={filters.state}
                                            onChange={(e) => handleFilterChange('state', e.target.value)}
                                        >
                                            {states.map((state) => (
                                                <MenuItem key={state.id} value={state.id}>
                                                    {state.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                                {filters.state != 0 && (
                                    <>
                                        <Typography variant="body1" sx={{ marginTop: 2 }}>City</Typography>
                                        <Select
                                            fullWidth
                                            value={filters.city}
                                            onChange={(e) => handleFilterChange('city', e.target.value)}
                                        >
                                            {cities.map((city) => (
                                                <MenuItem key={city.id} value={city.id}>
                                                    {city.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                                <Typography variant="body1" sx={{ marginTop: 2 }}>Minimum Rating</Typography>
                                <Slider
                                    value={filters.rating}
                                    onChange={(e, value) => handleFilterChange('rating', value)}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={5}
                                    step={0.1}
                                />
                                <Typography variant="body1" sx={{ marginTop: 2 }}>Sort by</Typography>
                                <Select
                                    fullWidth
                                    value={sortOpt}
                                    onChange={toSort}
                                >
                                    <MenuItem value='id'>-</MenuItem>
                                    <MenuItem value='name'>Name</MenuItem>
                                    <MenuItem value='country'>Country</MenuItem>
                                    <MenuItem value='revenue'>Revenue</MenuItem>
                                </Select>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={applyFilters}
                                    sx={{ marginTop: 2, marginRight: 2 }}
                                >
                                    Apply Filters
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={resetFilters}
                                    sx={{ marginTop: 2 }}
                                >
                                    Reset Filters
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={9} container spacing={3}>
                        {museums.map((museum) => (
                            <Grid item xs={12} key={museum.mid}>
                                <Card sx={{
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow:
                                            '0 8px 16px rgba(0, 0, 0, 0.2)',
                                    },
                                }}>
                                    <CardMedia
                                        component="img"
                                        alt={museum.name}
                                        height="140"
                                        image={museum.photo_path || "/static/images/cards/default.jpg"}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {museum.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {museum.city}, {museum.country}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Revenue: ${museum.revenue}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Theme: {museum.theme}
                                        </Typography>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2" color="textSecondary">
                                                Rating:
                                            </Typography>
                                            <Rating value={museum.rating} precision={0.1} readOnly size="small" />
                                        </Stack>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={() => toEdit(museum.mid)}>Edit</Button>
                                        <Button size="small" color="secondary" onClick={() => handleDeleteMuseumItem(museum.mid)}>Delete</Button>
                                        <Button size="small" color="primary" onClick={() => toExhibitionsMuseum(museum.mid)}>See exhibitions</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Pagination
                        count={Math.ceil(totalMuseums / PAGE_MUSEUMS)}
                        page={currentP}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default MuseumsPage;
