import {Box, CssBaseline, Grid, Pagination} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../App.css';
import AttractionCard from '../components/AttractionCard';
import AttractionsFiltersPanel from '../components/AttractionsFiltersPanel';
import Footer from '../components/Footer';
import TopNavBar from '../components/TopNavBar';
import config from '../config.json';
import {Attraction} from '../types';

function AttractionsPage() {
    const [refetch, setRefetch] = useState(false);
    const nav = useNavigate();
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

    const PAGE_ATTRACTIONS = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [sortingOption, setSortingOption] = useState('');
    const [totalAttractions, setTotalAttractions] = useState(0);

    // Get the first 10 attractions with filters
    useEffect(() => {
        axios
            .get(
                `${config.SERVER_URL}/api/attractions/from/${(currentPage - 1) * PAGE_ATTRACTIONS + 1}/to/${currentPage * PAGE_ATTRACTIONS}`,
                {
                    params: {
                        sortingOption: sortingOption,
                        name: filters.name,
                        theme: filters.theme,
                        state: filters.state,
                        city: filters.city,
                        minimumRating: filters.rating,
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
                        (attraction: any) => new Attraction(attraction),
                    ),
                );
            });
        axios
            .get(`${config.SERVER_URL}/api/attractions/count`, {
                params: {
                    name: filters.name,
                    theme: filters.theme,
                    state: filters.state,
                    city: filters.city,
                    minimumRating: filters.rating,
                },
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then(function (response) {
                setTotalAttractions(response.data);
            });
        setRefetch(false);
    }, [currentPage, sortingOption, refetch]);

    // Deleting an attraction
    const handleDeleteAttractionItem = (attractionId: number) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this attraction?',
        );
        if (!confirmDelete) return;
        axios
            .delete(
                `${config.SERVER_URL}/api/attraction/delete/${attractionId}`,
                {
                    params: {
                        userType: userType,
                    },
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                },
            )
            .then(function (response) {
                console.log(response);
                setAttractions((prevAttractions) =>
                    prevAttractions.filter(
                        (attraction) => attraction.id !== attractionId,
                    ),
                );
                window.alert('Attraction deleted.');
            })
            .catch(function (error) {
                window.alert('Delete failed: ' + error.response.data);
            });
    };

    // Editing an attraction
    const toEdit = (attractionId: number) => {
        nav(`/attractions/` + String(attractionId));
    };

    // Sorting attractions
    const toSort = (event: any) => {
        setSortingOption(event.target.value);
    };

    // Viewing events for an attraction
    const toEventsAttraction = (attractionId: number) => {
        nav('/events-attraction/' + String(attractionId));
    };

    // Changing the page
    const handlePageChange = (_: any, value: any) => {
        setCurrentPage(value);
    };

    // Filters
    const [filters, setFilters] = useState({
        name: '',
        theme: '',
        state: 0,
        city: 0,
        rating: 0,
    });

    const [states, setStates] = useState([]);

    // Getting the states
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

    const [cities, setCities] = useState([]);

    // Getting the cities based on the selected state
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

    // Handling filter changes
    const handleFilterChange = (filterName: string, value: any) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
            [filterName === 'state' ? 'city' : '']: 0,
        }));
    };

    const applyFilters = () => {
        setCurrentPage(1);
        setRefetch(true);
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            theme: '',
            state: 0,
            city: 0,
            rating: 0,
        });
        setCities([]);
        setCurrentPage(1);
    };

    return (
        <>
            <CssBaseline />
            <TopNavBar />
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
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                        <AttractionsFiltersPanel
                            filters={filters}
                            states={states}
                            cities={cities}
                            onFilterChange={handleFilterChange}
                            onApply={applyFilters}
                            onReset={resetFilters}
                            sortingOption={sortingOption}
                            onSortChange={toSort}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9} container spacing={3}>
                        {attractions.map((attraction) => (
                            <AttractionCard
                                userType={userType}
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
                        page={currentPage}
                        onChange={handlePageChange}
                        color='primary'
                    />
                </Box>
            </Box>
            <Footer />
        </>
    );
}

export default AttractionsPage;
