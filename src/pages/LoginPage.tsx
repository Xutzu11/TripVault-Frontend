import {Box, Container} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import config from '../config.json';

const LoginPage = () => {
    const nav = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios
            .get(`${config.SERVER_URL}/api/access`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then(() => {
                nav(`/attractions`);
            })
            .catch(() => {
                localStorage.removeItem('token');
            });
    });

    useEffect(() => {
        const handleKeyPress = (event: any) => {
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
            const response = await axios.get(
                `${config.SERVER_URL}/api/login/${username}/${password}`,
            );
            if (response.status === 200) {
                console.log('login success: token:', response.data);
                localStorage.setItem('token', response.data);
                setUsername('');
                setPassword('');
                nav(`/attractions`);
            }
        } catch (error: any) {
            console.log('login error:', error.response.data);
            setErrorMessage(error.response.data);
        }
    };

    return (
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
                component='main'
                maxWidth='xs'
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
                    <LoginForm
                        username={username}
                        password={password}
                        setUsername={setUsername}
                        setPassword={setPassword}
                        errorMessage={errorMessage}
                        handleLogin={handleLogin}
                        nav={nav}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
