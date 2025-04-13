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
import TopNavBar from '../components/TopNavBar';
import config from '../config.json';

function EventsPage() {
    const [status, setStatus] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const nav = useNavigate();

    const [sortOpt, setSortOpt] = useState('');
    const [access, setAccess] = useState(false);
    const [currentP, setCurrentP] = useState(1);
    const PAGE_EXH = 10;
    const [events, setEvents] = useState([]);
    const [totalEvents, setTotalEvents] = useState(0);

    const fetchEvents = async (page = 1) => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/events/from/${(page - 1) * PAGE_EXH + 1}/to/${page * PAGE_EXH}`,
                {
                    params: {
                        sortopt: sortOpt,
                    },
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                },
            );
            setEvents(response.data);
            const countResponse = await axios.get(
                `${config.SERVER_URL}/api/events/count`,
                {
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

                await axios.get(`${config.SERVER_URL}/api/access/user`, {
                    headers: {
                        Authorization: token,
                    },
                });

                setAccess(true);
            } catch (error) {
                nav('/');
            }
        };

        fetchData();
    }, [nav]);

    useEffect(() => {
        fetchEvents(currentP);
        setRefetch(false);
    }, [currentP, refetch, sortOpt]);

    useEffect(() => {
        if (status) {
            const syncEvents = localStorage.getItem('events') || '[]';
            const parsedSyncEvents = JSON.parse(syncEvents);
            parsedSyncEvents.forEach((event) => {
                axios
                    .post(
                        `${config.SERVER_URL}/api/event/add/${event.name}&${event.description}&${event.price}&${event.mid}`,
                        {
                            headers: {
                                Authorization: localStorage.getItem('token'),
                            },
                        },
                    )
                    .then(() => {})
                    .catch(() => {});
            });
            localStorage.setItem('events', JSON.stringify([]));
        }
        setCurrentP(1);
        setRefetch(true);
    }, [status]);

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

    const handleDeleteEventItem = (eventID) => {
        if (!access) {
            window.alert('You must have admin rights in order to delete.');
            return;
        }
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
                    prevEvents.filter((event) => event.id !== eventID),
                );
                window.alert('Event deleted.');
            })
            .catch((error) => {
                window.alert('Delete failed: ' + error.response.data);
            });
    };

    const [filters, setFilters] = useState({
        name: '',
        price: 0,
    });

    const toEdit = (eventID) => {
        nav(`/events/` + String(eventID));
    };

    const toSort = (event) => {
        setSortOpt(event.target.value);
    };

    const handlePageChange = (event, value) => {
        setCurrentP(value);
    };

    useEffect(() => {
        setEvents([]);
    }, []);

    const handleFilterChange = (filterName: string, value: any) => {
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
            price: 0,
        });
        setCurrentP(1);
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
                            {/* Left: Filters Panel */}
                            <Grid item xs={12} sm={3}>
                                <EventsFiltersPanel
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onApply={applyFilters}
                                    onReset={resetFilters}
                                    sortingOption={sortOpt}
                                    onSortChange={toSort}
                                />
                            </Grid>

                            {/* Right: Event cards */}
                            <Grid item xs={12} sm={9}>
                                <Grid container spacing={3}>
                                    {events.map((event) => (
                                        <Grid item xs={12} key={event.id}>
                                            <EventCard
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
                                            totalEvents / PAGE_EXH,
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
        </>
    );
}

export default EventsPage;
