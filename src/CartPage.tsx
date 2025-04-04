// CartPage.tsx
import {Check, Remove, RemoveShoppingCart} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    IconButton,
    ThemeProvider,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import config from './config.json';
import theme from './theme';
import {CartItem} from './types';

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
            localStorage.getItem('exhibitionsCart') || '[]',
        ) as CartItem[];
        setCartItems(cart);
    }, []);

    const handleDeleteCartItem = (exhibitionID: number) => {
        const updatedCart = cartItems
            .map((item) => {
                if (item.exhibition.id === exhibitionID) {
                    return {...item, quantity: item.quantity - 1};
                }
                return item;
            })
            .filter((item) => item.quantity > 0);

        localStorage.setItem('exhibitionsCart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };

    const handleRemoveCartItem = (exhibitionID: number) => {
        const updatedCart = cartItems
            .map((item) => {
                if (item.exhibition.id === exhibitionID) {
                    return {...item, quantity: 0};
                }
                return item;
            })
            .filter((item) => item.quantity > 0);

        localStorage.setItem('exhibitionsCart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };

    const calculateTotalPrice = () => {
        return cartItems
            .reduce(
                (total, item) => total + item.quantity * item.exhibition.price,
                0,
            )
            .toFixed(2);
    };

    const handleGoBack = () => {
        nav(-1);
    };

    const handlePurchase = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsPurchased(true);
            setTimeout(() => {
                setIsPurchased(false);
            }, 2000);
        }, 2000);
        setTimeout(() => {
            axios
                .post(
                    `${config.SERVER_URL}/api/purchase`,
                    {
                        cart: cartItems,
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        },
                    },
                )
                .then((response) => {
                    localStorage.setItem('exhibitionsCart', JSON.stringify([]));
                    setCartItems([]);
                    alert(response.data);
                })
                .catch((error) => {
                    alert('Purchase failed: ' + error.response.data);
                });
        }, 1000);
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
                                    <Card
                                        sx={{
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow:
                                                    '0 8px 16px rgba(0, 0, 0, 0.2)',
                                            },
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant='h5'>
                                                {item.exhibition.name}
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                color='textSecondary'
                                            >
                                                {item.exhibition.description}
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                color='textSecondary'
                                            >
                                                Price: ${item.exhibition.price}
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                color='textSecondary'
                                            >
                                                Quantity: {item.quantity}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <IconButton
                                                size='small'
                                                color='secondary'
                                                onClick={() =>
                                                    handleDeleteCartItem(
                                                        item.exhibition.id,
                                                    )
                                                }
                                            >
                                                <Remove />
                                            </IconButton>
                                            <IconButton
                                                size='small'
                                                color='secondary'
                                                onClick={() =>
                                                    handleRemoveCartItem(
                                                        item.exhibition.id,
                                                    )
                                                }
                                            >
                                                <RemoveShoppingCart />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
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
                                color='primary'
                                onClick={handleGoBack}
                                sx={{marginRight: 2}}
                            >
                                Go Back
                            </Button>
                            <Button
                                variant='contained'
                                color='secondary'
                                disabled={cartItems.length == 0}
                                onClick={handlePurchase}
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
                                    ? 'Processing...'
                                    : isPurchased
                                      ? 'Purchased'
                                      : 'Purchase'}
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default CartPage;
