import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config.json';
import { ThemeProvider, CssBaseline, Container, Box, Typography, TextField, Button, Card, CardContent, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import theme from './theme'; // Assuming you have a theme.js file with your custom dark theme

const RegisterPage = () => {
    const nav = useNavigate();
    const [username, setUsername] = useState('');
    const [fname, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [lname, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [valid, setValid] = useState('red');

    const handleRegister = async () => {
        setValid('red');
        if (username === '') {
            setErrorMessage("Username cannot be empty.");
            return;
        }
        if (fname === '' || lname === '') {
            setErrorMessage("Name cannot be empty.");
            return;
        }
        if (email === '') {
            setErrorMessage("Email cannot be empty.");
            return;
        }
        if (password.length < 5) {
            setErrorMessage("Password must contain at least 5 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
        try {
            const response = await axios.post(`${config.SERVER_URL}/api/register`, 
                {
                    Username: username,
                    FirstName: fname,
                    LastName: lname,
                    Email: email,
                    Password: password,
                }
            );
            if (response.status === 200) {
                setValid('green');
                setErrorMessage(response.data);
                setUsername('');
                setEmail('');
                setFirstName('');
                setLastName('');
                setPassword('');
                setConfirmPassword('');
            }
        } 
        catch (error: any) {
            setErrorMessage(error.response);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
            <Container >
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh',
                }}
                >
                    <Card sx={{ padding: 3, margin: 3, maxWidth: 400 }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                Register
                            </Typography>
                            <Typography variant="body2" color={valid} gutterBottom>
                                {errorMessage}
                            </Typography>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="First Name"
                                type="text"
                                value={fname}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Last Name"
                                type="text"
                                value={lname}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleRegister}>
                                    Register
                                </Button>
                                <Button variant="text" onClick={() => nav(`/`)}>
                                    Already have an account? Login here.
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
            </Box>
        </ThemeProvider>
    );
};

export default RegisterPage;
