// components/CartItemCard.tsx
import {Remove, RemoveShoppingCart} from '@mui/icons-material';
import {
    Card,
    CardActions,
    CardContent,
    IconButton,
    Typography,
} from '@mui/material';
import {CartItem} from '../types';

interface CartItemCardProps {
    item: CartItem;
    onDecrease: (id: number) => void;
    onRemove: (id: number) => void;
}

const CartItemCard = ({item, onDecrease, onRemove}: CartItemCardProps) => {
    return (
        <Card
            sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <CardContent>
                <Typography variant='h5'>{item.event.name}</Typography>
                <Typography variant='body2' color='textSecondary'>
                    {item.event.description}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                    Price: ${item.event.price}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                    Quantity: {item.quantity}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton
                    size='small'
                    color='secondary'
                    onClick={() => onDecrease(item.event.id)}
                >
                    <Remove />
                </IconButton>
                <IconButton
                    size='small'
                    color='secondary'
                    onClick={() => onRemove(item.event.id)}
                >
                    <RemoveShoppingCart />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default CartItemCard;
