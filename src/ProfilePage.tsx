import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from './config.json';
import { ThemeProvider, CssBaseline, Container, Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import theme from './theme'; // Assuming you have a theme.js file with your custom dark theme

const ProfilePage = () => {
    const [userData, setUserData] = useState({username: '', fname: '', lname: '', email: '', role: ''});
    const navigate = useNavigate();
    const [access, setAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await axios.get(`${config.SERVER_URL}/api/access/user`, {
                    headers: {
                        Authorization: token
                    }
                });
                setUserData(response.data);
                setAccess(true);
            } catch (error) {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    function goToMain() {
        navigate('/museums');
    }

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
            }}>
            <Container>
                {access ? (
                    <Card sx={{ marginTop: 5, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                Account Details
                            </Typography>
                            <Typography variant="body1">
                                <strong>Username:</strong> {userData.username}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Full Name:</strong> {userData.fname} {userData.lname}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Email:</strong> {userData.email}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Role:</strong> {userData.role}
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                            <Button variant="contained" color="primary" onClick={goToMain}>
                                Back to Museums
                            </Button>
                        </Box>
                    </Card>
                ) : (
                    <Typography variant="h6" color="error" align="center">
                        Please login to access your profile.
                    </Typography>
                )}
            </Container>
        </Box>
        </ThemeProvider>
    );
};

export default ProfilePage;
