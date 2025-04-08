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
                    src='https://i.ibb.co/1f1WgXs/logo.png' // Replace with your museum icon
                    alt='Museum Icon'
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
