import {CheckCircleOutline, ErrorOutline} from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import config from '../config.json';

const SuccessPage = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            nav('/');
            return;
        }

        axios
            .get(`${config.SERVER_URL}/api/stripe/verify-session/${sessionId}`)
            .then((res) => {
                if (res.data.paid) {
                    setValid(true);
                    // TODO: handle successful payment
                    localStorage.removeItem('eventsCart');
                } else {
                    nav('/');
                }
            })
            .catch(() => nav('/'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background:
                    'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040)',
            }}
        >
            <Container maxWidth='sm'>
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: '#1f1f1f',
                        boxShadow: 5,
                        color: 'white',
                    }}
                >
                    {valid ? (
                        <>
                            <CheckCircleOutline
                                sx={{fontSize: 80, color: '#4caf50', mb: 2}}
                            />
                            <Typography variant='h4' gutterBottom>
                                Payment Successful!
                            </Typography>
                            <Typography
                                variant='body1'
                                sx={{mb: 3, color: '#bbbbbb'}}
                            >
                                Thank you for your purchase. A confirmation has
                                been sent to your email.
                            </Typography>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => nav('/')}
                            >
                                Back to Home
                            </Button>
                        </>
                    ) : (
                        <>
                            <ErrorOutline
                                sx={{fontSize: 80, color: '#f44336', mb: 2}}
                            />
                            <Typography variant='h5' gutterBottom>
                                Invalid Session
                            </Typography>
                            <Typography
                                variant='body1'
                                sx={{mb: 3, color: '#bbbbbb'}}
                            >
                                We couldn't verify your session. Please try
                                again or contact support.
                            </Typography>
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={() => nav('/')}
                            >
                                Back to Home
                            </Button>
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default SuccessPage;
