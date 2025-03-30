import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config.json';
import {
    ThemeProvider,
    CssBaseline,
    Container,
    Box,
    TextField,
    Button,
    Typography
} from '@mui/material';
import theme from './theme';

const AddExhibition = () => {
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
                        Authorization: token
                    }
                });

            } catch (error) {
                nav('/');
            }
        };
        fetchData();
    }, []);

    const nav = useNavigate();

    const [access, setAccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                await axios.get(`${config.SERVER_URL}/api/access/moderator`, {
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

    const [exhibitionName, setExhibitionName] = useState('');
    const [exhibitionDescription, setExhibitionDescription] = useState('');
    const [exhibitionPrice, setExhibitionPrice] = useState('');
    const [exhibitionMID, setExhibitionMID] = useState('');
    const [exhibitionStartDate, setExhibitionStartDate] = useState('');
    const [exhibitionEndDate, setExhibitionEndDate] = useState('');

    const addExhibition = () => {
        axios.post(`${config.SERVER_URL}/api/exhibition/add/`,{
            params: {
                name: exhibitionName,
                description: exhibitionDescription,
                price: exhibitionPrice,
                mid: exhibitionMID,
                start_date: exhibitionStartDate,
                end_date: exhibitionEndDate
            }, 
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(function (response) {
                console.log(response);
                window.alert("Exhibition added.");
            })
            .catch(function (error) {
                const syncExhibitions = localStorage.getItem("exhibitions") || "[]";
                const parsedSyncExhibitions = JSON.parse(syncExhibitions);
                const maxID = Math.max(...parsedSyncExhibitions.map((exhibition: any) => exhibition.id), 0);
                localStorage.setItem("exhibitions", JSON.stringify([...parsedSyncExhibitions, {
                    name: exhibitionName,
                    description: exhibitionDescription,
                    price: exhibitionPrice,
                    mid: exhibitionMID,
                    start_date: exhibitionStartDate,
                    end_date: exhibitionEndDate
                }]));
                console.log(localStorage.getItem("exhibitions"));
                window.alert("Add failed: " + error.response.data);
            });
        setExhibitionName(''); setExhibitionDescription(''); setExhibitionPrice(''); setExhibitionMID(''); setExhibitionStartDate(''); setExhibitionEndDate('');
    };

    const handleExhibitionNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setExhibitionName(event.target.value);
    };

    const handleExhibitionDescriptionChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setExhibitionDescription(event.target.value);
    };

    const handleExhibitionPriceChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setExhibitionPrice(event.target.value);
    };

    const handleExhibitionMIDChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setExhibitionMID(event.target.value);
    };

    const handleExhibitionStartDateChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setExhibitionStartDate(event.target.value);
    };

    const handleExhibitionEndDateChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setExhibitionEndDate(event.target.value);
    };

    const goToMain = () => {
        nav('/exhibitions');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                background: 'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Container>
                <Box sx={{ padding: 3 }}>
                    {access ? (
                        <>
                            <Typography variant="h4" align="center" gutterBottom>Add Exhibition</Typography>
                            <form>
                                <TextField
                                    label="Name"
                                    type="text"
                                    value={exhibitionName}
                                    onChange={handleExhibitionNameChange}
                                    fullWidth
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Description"
                                    type="text"
                                    value={exhibitionDescription}
                                    onChange={handleExhibitionDescriptionChange}
                                    fullWidth
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={exhibitionPrice}
                                    onChange={handleExhibitionPriceChange}
                                    fullWidth
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Museum ID"
                                    type="text"
                                    value={exhibitionMID}
                                    onChange={handleExhibitionMIDChange}
                                    fullWidth
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    value={exhibitionStartDate}
                                    onChange={handleExhibitionStartDateChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="End Date"
                                    type="date"
                                    value={exhibitionEndDate}
                                    onChange={handleExhibitionEndDateChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ marginBottom: 2 }}
                                />
                            </form>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Button variant="contained" color="primary" onClick={addExhibition}>Add</Button>
                                <Button variant="contained" onClick={goToMain}>Main page</Button>
                            </Box>
                        </>
                    ) : (
                        <Typography variant="h6" align="center" color="error">You must have admin rights in order to add.</Typography>
                    )}
                </Box>
            </Container>
            </Box>
        </ThemeProvider>
    );
};

export default AddExhibition;
