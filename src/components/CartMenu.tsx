import {Remove} from '@mui/icons-material';
import {Box, Button, IconButton, Menu, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

interface CartItem {
    event: {
        id: number;
        name: string;
        price: number;
    };
    quantity: number;
}

interface CartMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
}

const CartMenu = ({anchorEl, open, onClose}: CartMenuProps) => {
    const [refetchCart, setRefetchCart] = useState(false);
    const nav = useNavigate();

    // Function to get cart items from local storage
    const getCartItems = () => {
        const cart = JSON.parse(
            localStorage.getItem('eventsCart') || '[]',
        ) as CartItem[];
        return cart;
    };

    const [cartItems, setCartItems] = useState(getCartItems());

    // Function to calculate total price of items in the cart
    const calculateTotalPrice = () => {
        return cartItems
            .reduce(
                (total, item) => total + item.quantity * item.event.price,
                0,
            )
            .toFixed(2);
    };

    useEffect(() => {
        setCartItems(getCartItems());
        setRefetchCart(false);
    }, [refetchCart]);

    // Function to delete a cart item
    const onDeleteCartItem = (eventId: number) => {
        const cart = getCartItems();
        const index = cart.findIndex((item) => item.event.id === eventId);
        if (index !== -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            localStorage.setItem('eventsCart', JSON.stringify(cart));
            setRefetchCart(true);
        }
    };

    // Function to navigate to the cart page
    const toCart = () => {
        nav('/cart');
    };

    return (
        <Menu
            sx={{mt: '45px'}}
            id='menu-cart'
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            onClose={onClose}
        >
            <Box sx={{padding: 2, minWidth: 300}}>
                <Typography variant='h6'>Shopping cart</Typography>
                {cartItems.length === 0 ? (
                    <Typography>Your cart is empty.</Typography>
                ) : (
                    cartItems.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: 1,
                            }}
                        >
                            <Typography>
                                {item.event.name} (x{item.quantity})
                            </Typography>
                            <Typography>
                                ${(item.quantity * item.event.price).toFixed(2)}
                            </Typography>
                            <IconButton
                                size='small'
                                color='secondary'
                                onClick={() => onDeleteCartItem(item.event.id)}
                            >
                                <Remove />
                            </IconButton>
                        </Box>
                    ))
                )}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: 1,
                        borderTop: '1px solid #ddd',
                        marginTop: 1,
                    }}
                >
                    <Typography variant='h6'>Total</Typography>
                    <Typography variant='h6'>
                        ${calculateTotalPrice()}
                    </Typography>
                </Box>
                <Button
                    variant='contained'
                    color='primary'
                    sx={{marginTop: 2, width: '100%'}}
                    onClick={toCart}
                >
                    Go to Cart
                </Button>
            </Box>
        </Menu>
    );
};

export default CartMenu;
