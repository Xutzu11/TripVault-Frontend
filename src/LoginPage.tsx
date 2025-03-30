import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Alert, ThemeProvider } from '@mui/material';
import config from './config.json';
import theme from './theme';

const LoginPage = () => {
    const nav = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get(`${config.SERVER_URL}/api/access/user`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        })
            .then(() => {
                nav(`/museums`);
            })
            .catch(() => {
                localStorage.removeItem('token');
            });
    })

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                handleLogin();
            }
        };

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [username, password]);

    const handleLogin = async () => {
        console.log('login tried');
        try {
            const response = await axios.get(`${config.SERVER_URL}/api/login/${username}/${password}`);
            if (response.status === 200) {
                console.log('login success: token:', response.data);
                localStorage.setItem('token', response.data);
                setUsername('');
                setPassword('');
                nav(`/museums`);
            }
        } catch (error) {
            console.log('login error:', error.response.data
            );
            setErrorMessage(error.response.data);
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(https://i.ibb.co/DMNFDyL/bkg.png)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    backgroundColor: '#393939',
                    borderRadius: 2,
                    padding: 3,
                    boxShadow: 3,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ color: '#d4b699' }}>
                        Welcome, please login!
                    </Typography>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mt: 2, color: '#d4b699' }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{
                                '& .MuiInputLabel-root': { color: '#ad9267' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#ad9267' },
                                    '&:hover fieldset': { borderColor: '#d4b699' },
                                    '&.Mui-focused fieldset': { borderColor: '#d4b699' },
                                    '& input': { color: '#d4b699' },
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiInputLabel-root': { color: '#ad9267' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#ad9267' },
                                    '&:hover fieldset': { borderColor: '#d4b699' },
                                    '&.Mui-focused fieldset': { borderColor: '#d4b699' },
                                    '& input': { color: '#d4b699' },
                                },
                            }}
                        />
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#ad9267',
                                color: '#393939',
                                textTransform: "none",
                                '&:hover': {
                                    backgroundColor: '#d4b699',
                                },
                            }}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                                color: '#ad9267',
                                borderColor: '#ad9267',
                                textTransform: "none",
                                '&:hover': {
                                    borderColor: '#d4b699',
                                    color: '#d4b699',
                                },
                            }}
                            onClick={() => nav(`/register`)}
                        >
                            Don't have an account? Create one here.
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
        </ThemeProvider>
    );
};

export default LoginPage;
