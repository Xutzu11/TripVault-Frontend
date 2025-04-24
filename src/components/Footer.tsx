// components/Footer.tsx
import {Box, Container, Link, Typography} from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#282828',
                color: '#d4b699',
                py: 2,
                borderTop: '1px solid #444',
            }}
        >
            <Container maxWidth='lg' sx={{textAlign: 'center'}}>
                <Box
                    component='img'
                    src='https://storage.googleapis.com/tripvault/logo.png'
                    alt='Museum Logo'
                    sx={{height: 100, mb: 2}}
                />
                <Typography variant='body2'>
                    © 2025 TripVault. All rights reserved.
                </Typography>
                <Link href='/' underline='hover'>
                    Terms of Use
                </Link>
                <Link href='/' underline='hover' sx={{ml: 2}}>
                    Privacy Policy
                </Link>
            </Container>
        </Box>
    );
};

export default Footer;
