import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from './config.json';
import { ThemeProvider, CssBaseline, Container, Box, Typography, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import theme from './theme'; // Assuming you have a theme.js file with your custom dark theme

const EditMuseum = () => {
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
    const { museumID } = useParams();

    const [access, setAccess] = useState(false);
    const [museumName, setMuseumName] = useState('');
    const [museumRevenue, setMuseumRevenue] = useState('');
    const [museumCountry, setMuseumCountry] = useState('');
    const [museumCity, setMuseumCity] = useState('');
    const [museumRating, setMuseumRating] = useState('');
    const [museumPhotoPath, setMuseumPhotoPath] = useState('');
    const [museumLat, setMuseumLat] = useState('');
    const [museumLng, setMuseumLng] = useState('');
    const [museumTheme, setMuseumTheme] = useState('');
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

    useEffect(() => {
        if (!museumID) return;

        axios.get(`${config.SERVER_URL}/api/museum/${museumID}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(response => {
                const data = response.data;
                setMuseumName(data.name);
                setMuseumRevenue(data.revenue);
                setMuseumCountry(data.country);
                setMuseumCity(data.city);
                setMuseumRating(data.rating);
                setMuseumPhotoPath(data.photo_path);
                setMuseumLat(data.lat);
                setMuseumLng(data.lng);
                setMuseumTheme(data.theme);
            })
            .catch(() => {
                const syncMuseums = localStorage.getItem("museums") || "[]";
                const parsedSyncMuseums = JSON.parse(syncMuseums);
                const foundMuseums = parsedSyncMuseums.filter((museum: any) => (museum.id == museumID));
                if (foundMuseums.length === 0) {
                    goToMain();
                } else {
                    const museum = foundMuseums[0];
                    setMuseumName(museum.name);
                    setMuseumRevenue(museum.revenue);
                    setMuseumCountry(museum.country);
                    setMuseumCity(museum.city);
                    setMuseumRating(museum.rating);
                    setMuseumPhotoPath(museum.photo_path);
                    setMuseumLat(museum.lat);
                    setMuseumLng(museum.lng);
                    setMuseumTheme(museum.theme);
                }
            });
    }, [museumID]);

    const saveMuseum = () => {
        axios.put(`${config.SERVER_URL}/api/museum/edit/${museumID}`, {
            name: museumName,
            revenue: museumRevenue,
            country: museumCountry,
            city: museumCity,
            rating: museumRating,
            photo_path: museumPhotoPath,
            lat: museumLat,
            lng: museumLng,
            theme: museumTheme,
            
        }, {headers: {
            Authorization: localStorage.getItem('token')
        }})
        .then(response => {
            console.log(response);
            window.alert("Museum edited.");
        })
        .catch((error) => {
            const syncMuseums = localStorage.getItem("museums") || "[]";
            const parsedSyncMuseums = JSON.parse(syncMuseums);
            localStorage.setItem("museums", JSON.stringify(parsedSyncMuseums.map(
                (museum: any) => 
                (
                    (museum.id == museumID) ? 
                    {
                        id: museumID,
                        name: museumName,
                        revenue: museumRevenue,
                        country: museumCountry,
                        city: museumCity,
                        rating: museumRating,
                        photo_path: museumPhotoPath,
                        lat: museumLat,
                        lng: museumLng,
                        theme: museumTheme
                    } 
                    : museum))
            ))
            console.log(localStorage.getItem("museums"));
            window.alert("Edit failed: " + error.response.data);
        });    
    }

    const goToMain = () => {
        nav('/museums');
    };

    const handleInputChange = (setter: any) => (event: any) => {
        setter(event.target.value);
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
                                Edit Museum
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                ID: {museumID}
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
                                    label="Museum Revenue"
                                    type="number"
                                    value={museumRevenue}
                                    onChange={handleInputChange(setMuseumRevenue)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Museum Country"
                                    type="text"
                                    value={museumCountry}
                                    onChange={handleInputChange(setMuseumCountry)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Museum City"
                                    type="text"
                                    value={museumCity}
                                    onChange={handleInputChange(setMuseumCity)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Museum Rating"
                                    type="number"
                                    value={museumRating}
                                    onChange={handleInputChange(setMuseumRating)}
                                    inputProps={{ min: 0, max: 5, step: 0.1 }}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Photo Path"
                                    type="text"
                                    value={museumPhotoPath}
                                    onChange={handleInputChange(setMuseumPhotoPath)}
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
                                    label="Theme"
                                    type="text"
                                    value={museumTheme}
                                    onChange={handleInputChange(setMuseumTheme)}
                                />
                            </Box>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                            <Button variant="contained" color="primary" onClick={saveMuseum}>
                                Save
                            </Button>
                            <Button variant="contained" color="secondary" onClick={goToMain} sx={{ marginLeft: 2 }}>
                                Main Page
                            </Button>
                        </Box>
                    </Card>
                ) : (
                    <Typography variant="h6" color="error" align="center">
                        You must have moderating rights in order to edit.
                    </Typography>
                )}
            </Container>
            </Box>
        </ThemeProvider>
    );
}

export default EditMuseum;
