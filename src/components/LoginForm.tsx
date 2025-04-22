// components/LoginForm.tsx
import {Alert, Box, Button, Typography} from '@mui/material';
import CustomTextField from './CustomTextField';

const LoginForm = ({
    username,
    password,
    setUsername,
    setPassword,
    errorMessage,
    handleLogin,
    nav,
}: any) => {
    return (
        <>
            <Typography component='h1' variant='h5' sx={{color: '#d4b699'}}>
                Welcome, please login!
            </Typography>

            {errorMessage && (
                <Alert severity='error' sx={{mt: 2, color: '#d4b699'}}>
                    {errorMessage}
                </Alert>
            )}

            <Box
                component='form'
                onSubmit={handleLogin}
                noValidate
                sx={{mt: 1}}
            >
                <CustomTextField
                    margin='normal'
                    required
                    id='username'
                    label='Username'
                    name='username'
                    autoComplete='username'
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <CustomTextField
                    margin='normal'
                    required
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    autoComplete='current-password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    type='button'
                    fullWidth
                    variant='contained'
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: '#ad9267',
                        color: '#393939',
                        textTransform: 'none',
                        '&:hover': {backgroundColor: '#d4b699'},
                    }}
                    onClick={handleLogin}
                >
                    Login
                </Button>

                <Button
                    fullWidth
                    variant='outlined'
                    sx={{
                        color: '#ad9267',
                        borderColor: '#ad9267',
                        textTransform: 'none',
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
        </>
    );
};

export default LoginForm;
