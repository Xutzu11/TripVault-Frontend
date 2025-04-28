import {
    Box,
    Button,
    CardMedia,
    CssBaseline,
    Stack,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {Html5QrcodeScanner} from 'html5-qrcode';
import {useEffect, useRef, useState} from 'react';
import Footer from '../components/Footer';
import TopNavBar from '../components/TopNavBar';
import config from '../config.json';

const ValidateTicketPage = () => {
    const [ticket, setTicket] = useState<{
        id: string;
        photo: string;
    } | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 5,
                qrbox: {width: 350, height: 350},
            },
            false,
        );

        scanner.render(
            (qrCodeMessage) => {
                axios
                    .get(`${config.SERVER_URL}/api/ticket/${qrCodeMessage}`, {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        },
                    })
                    .then((res) => {
                        setTicket({
                            id: qrCodeMessage,
                            photo: res.data,
                        });
                    })
                    .catch((error) => {
                        console.error('Error fetching ticket data:', error);
                        setTicket(null);
                    });
            },
            (errorMessage) => {
                console.error('Scan error:', errorMessage);
            },
        );

        scannerRef.current = scanner;
    }, []);

    const handleValidate = () => {
        if (ticket) {
            axios
                .post(`${config.SERVER_URL}/api/ticket/validate`, {
                    ticketId: ticket.id,
                })
                .then((res) => {
                    console.log('Ticket validated successfully:', res.data);
                    setTicket(null);
                })
                .catch((error) => {
                    console.error('Error validating ticket:', error);
                    setTicket(null);
                });
        } else {
            console.error('No ticket ID to validate.');
        }
    };

    const handleReject = () => {
        if (ticket) {
            axios
                .post(`${config.SERVER_URL}/api/ticket/reject`, {
                    ticketId: ticket.id,
                })
                .then((res) => {
                    console.log('Ticket rejected successfully:', res.data);
                    setTicket(null);
                })
                .catch((error) => {
                    console.error('Error rejecting ticket:', error);
                    setTicket(null);
                });
        } else {
            console.error('No ticket ID to reject.');
        }
    };

    const handlePass = () => {
        setTicket(null);
    };

    return (
        <>
            <CssBaseline />
            <TopNavBar />
            <Box
                sx={{
                    minHeight: '100vh',
                    background:
                        'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 3,
                    }}
                >
                    <Box
                        sx={{
                            overflow: 'auto',
                        }}
                    >
                        <div id='qr-reader' style={{width: '100%'}}></div>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            minHeight: '300px',
                            width: '100%',
                            borderRadius: 2,
                            backgroundColor: '#2f2f2f',
                            boxShadow: 3,
                            padding: 4,
                            mt: 4,
                        }}
                    >
                        {ticket ? (
                            <>
                                <Typography
                                    variant='h5'
                                    sx={{
                                        color: '#d4b699',
                                        marginBottom: 2,
                                    }}
                                >
                                    Ticket: {ticket.id}
                                </Typography>
                                <CardMedia
                                    component='img'
                                    image={ticket.photo}
                                    alt='Ticket Preview'
                                    sx={{
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                        marginBottom: '16px',
                                    }}
                                />
                                <Stack direction='row' spacing={2}>
                                    <Button
                                        variant='contained'
                                        color='success'
                                        onClick={handleValidate}
                                    >
                                        Validate
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='error'
                                        onClick={handleReject}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant='contained'
                                        sx={{
                                            backgroundColor: '#2196f3',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#1976d2',
                                            },
                                        }}
                                        onClick={handlePass}
                                    >
                                        Pass
                                    </Button>
                                </Stack>
                            </>
                        ) : (
                            <Typography
                                variant='h6'
                                sx={{
                                    color: '#d4b699',
                                    textAlign: 'center',
                                }}
                            >
                                No ticket identified. Please scan a QR code.
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Footer />
            </Box>
        </>
    );
};

export default ValidateTicketPage;
