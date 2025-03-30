import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config.json';
import { ThemeProvider, CssBaseline, Container, Box, Typography, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import theme from './theme'; // Assuming you have a theme.js file with your custom dark theme

const AddMuseum = () => {
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

    const [museumName, setMuseumName] = useState('');
    const [museumCountry, setMuseumCountry] = useState('');
    const [museumCity, setMuseumCity] = useState('');
    const [museumTheme, setMuseumTheme] = useState('');
    const [museumRevenue, setMuseumRevenue] = useState('');
    const [museumRating, setMuseumRating] = useState('');
    const [museumLat, setMuseumLat] = useState('');
    const [museumLng, setMuseumLng] = useState('');
    const [museumPhotoPath, setMuseumPhotoPath] = useState('');
    const [access, setAccess] = useState(false);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [nav]);

    const addMuseum = () => {
        axios.post(`${config.SERVER_URL}/api/museum/add`, {
            name: museumName,
            country: museumCountry,
            city: museumCity,
            theme: museumTheme,
            revenue: museumRevenue,
            rating: museumRating,
            lat: museumLat,
            lng: museumLng,
            photo_path: museumPhotoPath,
        }, { headers: { Authorization: localStorage.getItem('token') }
        })
            .then(response => {
                console.log(response);
                window.alert("Museum added.");
            })
            .catch((error) => {
                const syncMuseums = localStorage.getItem("museums") || "[]";
                const parsedSyncMuseums = JSON.parse(syncMuseums);
                const maxID = Math.max(...parsedSyncMuseums.map((museum: any) => museum.id), 0);
                localStorage.setItem("museums", JSON.stringify([...parsedSyncMuseums, { 
                    id: maxID + 1, 
                    name: museumName, 
                    country: museumCountry, 
                    city: museumCity, 
                    theme: museumTheme, 
                    revenue: museumRevenue, 
                    rating: museumRating, 
                    lat: museumLat, 
                    lng: museumLng, 
                    photo_path: museumPhotoPath 
                }]));
                console.log(localStorage.getItem("museums"));
                window.alert("Add failed: " + error.response.data);
            });
        setMuseumName(''); setMuseumCountry(''); setMuseumCity(''); setMuseumTheme(''); setMuseumRevenue(''); setMuseumRating(''); setMuseumLat(''); setMuseumLng(''); setMuseumPhotoPath('');
    };

    const handleInputChange = (setter: any) => (event: any) => {
        setter(event.target.value);
    };

    const goToMain = () => {
        nav('/museums');
    };

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        bgcolor: 'background.default',
                        color: 'text.primary'
                    }}
                >
                    <CircularProgress />
                </Box>
            </ThemeProvider>
        );
    }

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
                {access ? (
                    <Card sx={{ marginTop: 5, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                Add Museum
                            </Typography>
                            <Box component="form" noValidate autoComplete="off">
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Museum Name"
                                    type="text"
                                    value={museumName}
                                    onChange={handleInputChange(setMuseumName)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Country"
                                    type="text"
                                    value={museumCountry}
                                    onChange={handleInputChange(setMuseumCountry)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="City"
                                    type="text"
                                    value={museumCity}
                                    onChange={handleInputChange(setMuseumCity)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Theme"
                                    type="text"
                                    value={museumTheme}
                                    onChange={handleInputChange(setMuseumTheme)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Revenue"
                                    type="number"
                                    value={museumRevenue}
                                    onChange={handleInputChange(setMuseumRevenue)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Rating"
                                    type="number"
                                    value={museumRating}
                                    onChange={handleInputChange(setMuseumRating)}
                                    inputProps={{ min: 0, max: 5, step: 0.1 }}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Latitude"
                                    type="number"
                                    value={museumLat}
                                    onChange={handleInputChange(setMuseumLat)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Longitude"
                                    type="number"
                                    value={museumLng}
                                    onChange={handleInputChange(setMuseumLng)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Photo Path"
                                    type="text"
                                    value={museumPhotoPath}
                                    onChange={handleInputChange(setMuseumPhotoPath)}
                                />
                            </Box>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                            <Button variant="contained" color="primary" onClick={addMuseum}>
                                Add
                            </Button>
                            <Button variant="contained" color="secondary" onClick={goToMain} sx={{ marginLeft: 2 }}>
                                Main Page
                            </Button>
                        </Box>
                    </Card>
                ) : (
                    <Typography variant="h6" color="error" align="center">
                        You must have moderating rights in order to add.
                    </Typography>
                )}
            </Container>
            </Box>
        </ThemeProvider>
    );
};

export default AddMuseum;
