import {Box, CircularProgress, Typography} from '@mui/material';

const LoadingScreen = () => {
    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background:
                    'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040)',
                color: '#d4b699',
            }}
        >
            <CircularProgress color='primary' size={60} />
            <Typography variant='h6' sx={{marginTop: 2}}>
                Loading... Please wait.
            </Typography>
        </Box>
    );
};

export default LoadingScreen;
