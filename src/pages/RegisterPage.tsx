import {Box, Container} from '@mui/material';
import axios from 'axios';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import config from '../config.json';

const RegisterPage = () => {
    const nav = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [valid, setValid] = useState('red');

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}));
    };

    const handleRegister = async () => {
        setValid('red');

        const {
            username,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            role,
        } = formData;

        if (!username || !firstName || !lastName || !email || !password) {
            setErrorMessage('All fields are required.');
            return;
        }
        if (password.length < 5) {
            setErrorMessage('Password must contain at least 5 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(
                `${config.SERVER_URL}/api/register`,
                {
                    Username: username,
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    Password: password,
                    Role: role,
                },
            );

            if (response.status === 200) {
                setValid('green');
                setErrorMessage(response.data);
                setFormData({
                    username: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'user',
                });
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data || 'Registration failed');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage:
                    'url(https://storage.googleapis.com/tripvault/background.png)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                    }}
                >
                    <RegisterForm
                        {...formData}
                        errorMessage={errorMessage}
                        valid={valid}
                        onChange={handleChange}
                        onRegister={handleRegister}
                        onNavigateToLogin={() => nav('/')}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default RegisterPage;
