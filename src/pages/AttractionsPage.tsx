import {
    Box,
    CssBaseline,
    Grid,
    Pagination,
    ThemeProvider,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../App.css';
import AttractionCard from '../components/AttractionCard';
import FiltersPanel from '../components/FiltersPanel';
import TopNavBar from '../components/TopNavBar';
import config from '../config.json';
import theme from '../theme';
import {Attraction} from '../types';

function AttractionsPage() {
    // Login Status
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

    // data fetcher of attractions
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    nav('/');
                    return;
                }

                const response = await axios.get(
                    `${config.SERVER_URL}/api/access/user`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    },
                );

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
                        Authorization: token,
                    },
                });
                setAccess(true);
            } catch (error) {
                return;
            }
        };

        fetchData();
    }, []);

    const PAGE_ATTRACTIONS = 10;

    const [currentP, setCurrentP] = useState(1);
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [sortOpt, setSortOpt] = useState('');
    const [totalAttractions, setTotalAttractions] = useState(0);
    const settings = ['Profile', 'Logout'];
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElCart, setAnchorElCart] = useState(null);
    const [refetchCart, setRefetchCart] = useState(false);

    const getCartItems = () => {
        const cart = JSON.parse(localStorage.getItem('eventsCart') || '[]');
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
        return cart
            .reduce(
                (total, item) => total + item.quantity * item.event.price,
                0,
            )
            .toFixed(2);
    };

    // get the first 10 attractions with filters
    useEffect(() => {
        axios
            .get(
                `${config.SERVER_URL}/api/attractions/filtered/from/${(currentP - 1) * PAGE_ATTRACTIONS + 1}/to/${currentP * PAGE_ATTRACTIONS}`,
                {
                    params: {
                        sortopt: sortOpt,
                        name: filters.name,
                        theme: filters.theme,
                        minrev: filters.revenueRange[0],
                        maxrev: filters.revenueRange[1],
                        state: filters.state,
                        city: filters.city,
                        minrating: filters.rating,
                    },
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                },
            )
            .then(function (response) {
                console.log(response.data);
                setAttractions(
                    response.data.map(
                        (attraction) => new Attraction(attraction),
                    ),
                );
            })
            .catch(function () {
                const syncAttractions =
                    localStorage.getItem('attractions') || '[]';
                const parsedSyncAttractions = JSON.parse(syncAttractions);
                setAttractions(parsedSyncAttractions);
            });

        axios
            .get(`${config.SERVER_URL}/api/attractions/filtered/count`, {
                params: {
                    name: filters.name,
                    theme: filters.theme,
                    minrev: filters.revenueRange[0],
                    maxrev: filters.revenueRange[1],
                    state: filters.state,
                    city: filters.city,
                    minrating: filters.rating,
                },
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then(function (response) {
                setTotalAttractions(response.data);
            })
            .catch(function () {
                const syncAttractions =
                    localStorage.getItem('attractions') || '[]';
                const parsedSyncAttractions = JSON.parse(syncAttractions);
                setTotalAttractions(parsedSyncAttractions.length);
            });

        setRefetch(false);
    }, [currentP, refetch]);

    useEffect(() => {
        if (status) {
            const syncAttractions = localStorage.getItem('attractions') || '[]';
            const parsedSyncAttractions = JSON.parse(syncAttractions);
            parsedSyncAttractions.forEach((attraction: Attraction) => {
                axios
                    .post(
                        `${config.SERVER_URL}/api/attraction/add`,
                        attraction,
                        {
                            headers: {
                                Authorization: localStorage.getItem('token'),
                            },
                        },
                    )
                    .then(function () {})
                    .catch(function () {});
            });
            localStorage.setItem('attractions', JSON.stringify([]));
        }
        setCurrentP(1);
        setRefetch(true);
    }, [status]);

    const handleDeleteAttractionItem = (attraction_id: number) => {
        if (!access) {
            window.alert('You must have admin rights in order to delete.');
            return;
        }
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this attraction?',
        );
        if (!confirmDelete) return;
        axios
            .delete(
                `${config.SERVER_URL}/api/attraction/delete/${attraction_id}`,
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                },
            )
            .then(function (response) {
                console.log(response);
                setAttractions((prevAttractions) =>
                    prevAttractions.filter(
                        (attraction) => attraction.id !== attraction_id,
                    ),
                );
                window.alert('Attraction deleted.');
            })
            .catch(function (error) {
                const syncAttractions =
                    localStorage.getItem('attractions') || '[]';
                const parsedSyncAttractions = JSON.parse(syncAttractions);
                localStorage.setItem(
                    'attractions',
                    JSON.stringify(
                        parsedSyncAttractions.filter(
                            (attraction: Attraction) =>
                                attraction.id !== attraction_id,
                        ),
                    ),
                );
                window.alert('Delete failed: ' + error.response.data);
            });
    };

    useEffect(() => {
        setCartItems(getCartItems());
        setRefetchCart(false);
    }, [refetchCart]);

    const toAdd = () => {
        nav(`/attractions/add`);
    };

    const toEdit = (attraction_id: number) => {
        nav(`/attractions/` + String(attraction_id));
    };

    const toSort = (event) => {
        setSortOpt(event.target.value);
    };

    const toRevenue = () => {
        nav(`/revenue_chart`);
    };

    const toEvents = () => {
        nav('/events');
    };

    const toEventsAttraction = (attraction_id: number) => {
        nav('/events-attraction/' + String(attraction_id));
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
        localStorage.removeItem('eventsCart');
        nav('/');
    };

    useEffect(() => {
        setRefetch(true);
    }, [sortOpt]);

    const handlePageChange = (event, value) => {
        setCurrentP(value);
    };

    useEffect(() => {
        setAttractions([]);
    }, []);

    const [filters, setFilters] = useState({
        name: '',
        theme: '',
        revenueRange: [0, 1000000000] as [number, number],
        state: 0,
        city: 0,
        rating: 0,
    });

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios
            .get(`${config.SERVER_URL}/api/states`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then((response) => setStates(response.data))
            .catch((error) => console.error('Error fetching states:', error));
    }, []);

    useEffect(() => {
        if (filters.state) {
            axios
                .get(`${config.SERVER_URL}/api/cities`, {
                    params: {state: filters.state},
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                })
                .then((response) => setCities(response.data))
                .catch((error) =>
                    console.error('Error fetching cities:', error),
                );
        } else {
            setCities([]);
        }
    }, [filters.state]);

    const handleFilterChange = (filterName, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
            [filterName === 'state' ? 'city' : '']: 0,
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
            state: 0,
            city: 0,
            rating: 0,
        });
        setCities([]);
        setCurrentP(1);
        setRefetch(true);
    };

    const handleDeleteCartItem = (event_id: number) => {
        const cart = JSON.parse(localStorage.getItem('eventsCart') || '[]');
        const index = cart.findIndex((item) => item.event.id === event_id);

        if (index !== -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            localStorage.setItem('eventsCart', JSON.stringify(cart));
            setRefetchCart(true);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopNavBar
                name={name}
                cartItems={cartItems}
                onDeleteCartItem={handleDeleteCartItem}
                calculateTotalPrice={calculateTotalPrice}
            />
            <Box
                sx={{
                    padding: 3,
                    background:
                        'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040, #ad9267)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                <Typography variant='subtitle1' align='center' color='error'>
                    {status ? '' : 'Server is offline.'}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                        <FiltersPanel
                            filters={filters}
                            states={states}
                            cities={cities}
                            onFilterChange={handleFilterChange}
                            onApply={applyFilters}
                            onReset={resetFilters}
                            sortOpt={sortOpt}
                            onSortChange={toSort}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9} container spacing={3}>
                        {attractions.map((attraction) => (
                            <AttractionCard
                                attraction={attraction}
                                onEdit={toEdit}
                                onDelete={handleDeleteAttractionItem}
                                onViewEvents={toEventsAttraction}
                            />
                        ))}
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 2,
                    }}
                >
                    <Pagination
                        count={Math.ceil(totalAttractions / PAGE_ATTRACTIONS)}
                        page={currentP}
                        onChange={handlePageChange}
                        color='primary'
                    />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default AttractionsPage;
