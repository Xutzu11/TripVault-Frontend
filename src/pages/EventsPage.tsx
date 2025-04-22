import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Pagination,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import EventCard from '../components/EventCard';
import EventsFiltersPanel from '../components/EventsFiltersPanel';
import Footer from '../components/Footer';
import TopNavBar from '../components/TopNavBar';
import config from '../config.json';
import {Event} from '../types';

function EventsPage() {
    const [refetch, setRefetch] = useState(false);
    const nav = useNavigate();

    const [sortOpt, setSortOpt] = useState('');
    const [currentP, setCurrentP] = useState(1);
    const PAGE_EVENTS = 10;
    const [events, setEvents] = useState([]);
    const [totalEvents, setTotalEvents] = useState(0);

    const [userType, setUserType] = useState('');

    // Check if user has access
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            nav('/');
            return;
        }
        axios
            .get(`${config.SERVER_URL}/api/access/user`, {
                headers: {Authorization: token},
            })
            .then((_) => {
                setUserType('user');
            })
            .catch((_) => {
                axios
                    .get(`${config.SERVER_URL}/api/access/admin`, {
                        headers: {Authorization: token},
                    })
                    .then((_) => {
                        setUserType('admin');
                    })
                    .catch((error) => {
                        console.error('Error fetching user type:', error);
                        nav('/');
                    });
            });
    }, []);

    const fetchEvents = async (page = 1) => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/events/from/${(page - 1) * PAGE_EVENTS + 1}/to/${page * PAGE_EVENTS}`,
                {
                    params: {
                        sortopt: sortOpt,
                        name: filters.name,
                        price: filters.price,
                        state: filters.state,
                        city: filters.city,
                    },
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                },
            );
            setEvents(response.data.map((event: any) => new Event(event)));

            const countResponse = await axios.get(
                `${config.SERVER_URL}/api/events/count`,
                {
                    params: {
                        name: filters.name,
                        price: filters.price,
                        state: filters.state,
                        city: filters.city,
                    },
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                },
            );
            setTotalEvents(countResponse.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    nav('/');
                    return;
                }
            } catch (error) {
                nav('/');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetchEvents(currentP);
        setRefetch(false);
    }, [currentP, refetch, sortOpt]);

    const handleDeleteEventItem = (eventID: Number) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this event?',
        );
        if (!confirmDelete) return;
        axios
            .delete(`${config.SERVER_URL}/api/event/delete/${eventID}`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then((response) => {
                console.log(response);
                setEvents((prevEvents) =>
                    prevEvents.filter((event: Event) => event.id !== eventID),
                );
                window.alert('Event deleted.');
            })
            .catch((error) => {
                window.alert('Delete failed: ' + error.response.data);
            });
    };

    const [filters, setFilters] = useState({
        name: '',
        price: 100,
        state: 0,
        city: 0,
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

    const toEdit = (eventID: Number) => {
        nav(`/events/` + String(eventID));
    };

    const toSort = (event: any) => {
        setSortOpt(event.target.value);
    };

    const handlePageChange = (_: any, value: any) => {
        setCurrentP(value);
    };

    useEffect(() => {
        setEvents([]);
    }, []);

    const handleFilterChange = (filterName: string, value: any) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
            ...(filterName === 'state' && {city: 0}),
        }));
    };

    const applyFilters = () => {
        setCurrentP(1);
        setRefetch(true);
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            price: 100,
            state: 0,
            city: 0,
        });
        setCities([]);
        setCurrentP(1);
        setRefetch(true);
    };

    return (
        <>
            <CssBaseline />
            <TopNavBar />
            <Box
                sx={{
                    background:
                        'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Container>
                    <Box sx={{padding: 3}}>
                        <Typography variant='h4' align='center' gutterBottom>
                            Events
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3}>
                                <EventsFiltersPanel
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onApply={applyFilters}
                                    onReset={resetFilters}
                                    sortingOption={sortOpt}
                                    onSortChange={toSort}
                                    states={states}
                                    cities={cities}
                                />
                            </Grid>

                            <Grid item xs={12} sm={9}>
                                <Grid container spacing={3}>
                                    {events.map((event: Event) => (
                                        <Grid item xs={12} key={event.id}>
                                            <EventCard
                                                userType={userType}
                                                event={event}
                                                onEdit={toEdit}
                                                onDelete={handleDeleteEventItem}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginTop: 2,
                                    }}
                                >
                                    <Pagination
                                        count={Math.ceil(
                                            totalEvents / PAGE_EVENTS,
                                        )}
                                        page={currentP}
                                        onChange={handlePageChange}
                                        color='primary'
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
}

export default EventsPage;
