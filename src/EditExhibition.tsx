import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from './config.json';
import { ThemeProvider, CssBaseline, Box, TextField, Button, Typography, Container, Grid, Paper } from '@mui/material';
import theme from './theme';

const EditExhibition = () => {
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
    const { exhibitionID } = useParams();

    const [access, setAccess] = useState(false);
    const [exhibitionName, setExhibitionName] = useState('');
    const [exhibitionDescription, setExhibitionDescription] = useState('');
    const [exhibitionPrice, setExhibitionPrice] = useState('');
    const [exhibitionMID, setExhibitionMID] = useState('');
    const [exhibitionStartDate, setExhibitionStartDate] = useState('');
    const [exhibitionEndDate, setExhibitionEndDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    nav('/');
                    return;
                }

                await axios.get(`${config.SERVER_URL}/api/access/moderator`, {
                    headers: {
                        Authorization: token
                    }
                });
                setAccess(true);

            } catch (error) {
                nav('/');
            }
        };

        fetchData();
    }, [nav]);

    useEffect(() => {
        if (!exhibitionID) return;

        axios.get(`${config.SERVER_URL}/api/exhibition/${exhibitionID}`,
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }
        )
            .then(response => {
                setExhibitionName(response.data.name);
                setExhibitionDescription(response.data.description);
                setExhibitionPrice(response.data.price);
                setExhibitionMID(response.data.mid);
                setExhibitionStartDate(response.data.start_date);
                setExhibitionEndDate(response.data.end_date);
            })
            .catch(() => {
                const syncExhibitions = localStorage.getItem("exhibitions") || "[]";
                const parsedSyncExhibitions = JSON.parse(syncExhibitions);
                const foundExhibition = parsedSyncExhibitions.find((exhibition) => exhibition.id == exhibitionID);
                if (!foundExhibition) nav('/exhibitions');
                setExhibitionName(foundExhibition.name);
                setExhibitionDescription(foundExhibition.description);
                setExhibitionPrice(foundExhibition.price);
                setExhibitionMID(foundExhibition.mid);
                setExhibitionStartDate(foundExhibition.start_date);
                setExhibitionEndDate(foundExhibition.end_date);
            });
    }, [exhibitionID, nav]);

    const saveExhibition = () => {
        const token = localStorage.getItem('token');
        axios.put(`${config.SERVER_URL}/api/exhibition/edit/${exhibitionID}`, {
                params: {
                name: exhibitionName,
                description: exhibitionDescription,
                price: exhibitionPrice,
                mid: exhibitionMID,
                start_date: exhibitionStartDate,
                end_date: exhibitionEndDate
            }
        }, {
            headers: {
                Authorization: token
            }
        })
        .then(response => {
            console.log(response);
            window.alert("Exhibition edited.");
        })
        .catch((error) => {
            const syncExhibitions = localStorage.getItem("exhibitions") || "[]";
            const parsedSyncExhibitions = JSON.parse(syncExhibitions);
            localStorage.setItem("exhibitions", JSON.stringify(parsedSyncExhibitions.map(
                (exhibition) => 
                (exhibition.id == exhibitionID) ? 
                {
                    id: exhibitionID,
                    name: exhibitionName,
                    description: exhibitionDescription,
                    price: exhibitionPrice,
                    mid: exhibitionMID,
                    start_date: exhibitionStartDate,
                    end_date: exhibitionEndDate
                } 
                : exhibition))
            )
            window.alert("Edit failed: " + error.response.data);
        })
    };

    const handleExhibitionNameChange = (event) => setExhibitionName(event.target.value);
    const handleExhibitionDescriptionChange = (event) => setExhibitionDescription(event.target.value);
    const handleExhibitionPriceChange = (event) => setExhibitionPrice(event.target.value);
    const handleExhibitionStartDateChange = (event) => setExhibitionStartDate(event.target.value);
    const handleExhibitionEndDateChange = (event) => setExhibitionEndDate(event.target.value);

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
            <Container component="main" maxWidth="sm">
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {access ? (
                        <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
                            <Typography component="h1" variant="h5">Edit Exhibition</Typography>
                            <Typography variant="subtitle1">ID: {exhibitionID}</Typography>
                            <Box component="form" sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="name"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="name"
                                            label="Name"
                                            value={exhibitionName}
                                            onChange={handleExhibitionNameChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="description"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="description"
                                            label="Description"
                                            value={exhibitionDescription}
                                            onChange={handleExhibitionDescriptionChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="price"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="price"
                                            label="Price"
                                            type="number"
                                            value={exhibitionPrice}
                                            onChange={handleExhibitionPriceChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="start_date"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="start_date"
                                            label="Start Date"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={exhibitionStartDate}
                                            onChange={handleExhibitionStartDateChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="end_date"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="end_date"
                                            label="End Date"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={exhibitionEndDate}
                                            onChange={handleExhibitionEndDateChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="mid"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="mid"
                                            label="Museum ID"
                                            value={exhibitionMID}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={saveExhibition}
                                >
                                    Save
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => nav('/exhibitions')}
                                >
                                    Main Page
                                </Button>
                            </Box>
                        </Paper>
                    ) : (
                        <Typography variant="h6" color="error">You must have moderating rights in order to edit.</Typography>
                    )}
                </Box>
            </Container>
            </Box>
        </ThemeProvider>
    );
};

export default EditExhibition;
