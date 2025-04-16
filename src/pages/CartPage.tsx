// CartPage.tsx
import {Check} from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    ThemeProvider,
    Typography,
} from '@mui/material';
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import CartItemCard from '../components/CardItemCard';
import config from '../config.json';
import theme from '../theme';
import {CartItem} from '../types';

const CartPage = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    nav('/');
                    return;
                }

                await axios.get(`${config.SERVER_URL}/api/access/user`, {
                    headers: {
                        Authorization: token,
                    },
                });
            } catch (error) {
                nav('/');
            }
        };
        fetchData();
    }, []);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const cart = JSON.parse(
            localStorage.getItem('eventsCart') || '[]',
        ) as CartItem[];
        setCartItems(cart);
    }, []);

    const handleDeleteCartItem = (eventID: number) => {
        const updatedCart = cartItems
            .map((item) => {
                if (item.event.id === eventID) {
                    return {...item, quantity: item.quantity - 1};
                }
                return item;
            })
            .filter((item) => item.quantity > 0);

        localStorage.setItem('eventsCart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };

    const handleRemoveCartItem = (eventID: number) => {
        const updatedCart = cartItems
            .map((item) => {
                if (item.event.id === eventID) {
                    return {...item, quantity: 0};
                }
                return item;
            })
            .filter((item) => item.quantity > 0);

        localStorage.setItem('eventsCart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };

    const calculateTotalPrice = () => {
        return cartItems
            .reduce(
                (total, item) => total + item.quantity * item.event.price,
                0,
            )
            .toFixed(2);
    };

    const handleStripeCheckout = async () => {
        setIsProcessing(true);

        try {
            const stripe = await loadStripe(config.STRIPE_PUBLIC_KEY);

            const totalAmount = Math.round(
                cartItems.reduce(
                    (total, item) => total + item.quantity * item.event.price,
                    0,
                ) * 100,
            );

            const response = await axios.post(
                `${config.SERVER_URL}/api/stripe/create-checkout-session`,
                {
                    amount: totalAmount,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                },
            );

            const sessionId = response.data.id;

            if (stripe) {
                await stripe.redirectToCheckout({sessionId});
            } else {
                alert('Stripe failed to load.');
            }

            setIsProcessing(false);
        } catch (error: any) {
            setIsProcessing(false);
            console.error('Stripe Checkout error:', error);
            alert('Failed to initiate checkout: ' + error.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    background:
                        'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                }}
            >
                <Container sx={{padding: 3}}>
                    <Typography variant='h4' gutterBottom>
                        Shopping Cart
                    </Typography>
                    <Grid container spacing={3}>
                        {cartItems.length === 0 ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <Typography variant='h5'>
                                    Your cart is empty.
                                </Typography>
                            </Box>
                        ) : (
                            cartItems.map((item, index) => (
                                <Grid item xs={12} key={index}>
                                    <CartItemCard
                                        item={item}
                                        onDecrease={handleDeleteCartItem}
                                        onRemove={handleRemoveCartItem}
                                    />
                                </Grid>
                            ))
                        )}
                    </Grid>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 3,
                        }}
                    >
                        <Typography variant='h5'>
                            Total Price: ${calculateTotalPrice()}
                        </Typography>
                        <Box>
                            <Button
                                variant='contained'
                                color='secondary'
                                disabled={
                                    cartItems.length === 0 || isProcessing
                                }
                                onClick={handleStripeCheckout}
                                startIcon={
                                    isProcessing ? (
                                        <CircularProgress
                                            size={24}
                                            color='inherit'
                                        />
                                    ) : isPurchased ? (
                                        <Check />
                                    ) : null
                                }
                            >
                                {isProcessing
                                    ? 'Redirecting...'
                                    : 'Pay with Card'}
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default CartPage;
