import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography,
} from '@mui/material';

import {ArrowBack} from '@mui/icons-material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        role: '',
    });
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            nav('/');
            return;
        }
        axios
            .get(`${import.meta.env.VITE_SERVER_URL}/api/access`, {
                headers: {Authorization: token},
            })
            .then((res) => {
                setUserData(res.data);
                setLoading(false);
            })
            .catch(() => {
                nav('/');
            });
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Box
                sx={{
                    background:
                        'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                }}
            >
                <Container>
                    <Card sx={{marginTop: 5, padding: 3}}>
                        <CardContent>
                            <Typography variant='h4' gutterBottom>
                                Account Details
                            </Typography>
                            <Typography variant='body1'>
                                <strong>Username:</strong> {userData.username}
                            </Typography>
                            <Typography variant='body1'>
                                <strong>Full Name:</strong>{' '}
                                {userData.first_name} {userData.last_name}
                            </Typography>
                            <Typography variant='body1'>
                                <strong>Email:</strong> {userData.email}
                            </Typography>
                            <Typography variant='body1'>
                                <strong>Role:</strong> {userData.role}
                            </Typography>
                        </CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: 3,
                            }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => nav('/')}
                            >
                                <ArrowBack />
                            </Button>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default ProfilePage;
