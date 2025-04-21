// src/components/EventCard.tsx
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from '@mui/material';
import {Event as AttractionEvent} from '../types';

interface EventCardProps {
    event: AttractionEvent;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const EventCard = ({event, onEdit, onDelete}: EventCardProps) => {
    console.log('EventCard', event);
    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('eventsCart') || '[]');
        const index = cart.findIndex((item: any) => item.event.id === event.id);

        if (index !== -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({
                event: event,
                quantity: 1,
            });
        }

        localStorage.setItem('eventsCart', JSON.stringify(cart));

        // Optional: Dispatch a custom event to notify other components like CartMenu
        window.dispatchEvent(new Event('cartUpdated'));
    };

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
                <Typography gutterBottom variant='h5' component='div'>
                    {event.name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                    {event.description}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                    Price: ${event.price.toFixed(2)}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size='small'
                    color='primary'
                    onClick={() => onEdit(event.id)}
                >
                    Edit
                </Button>
                <Button
                    size='small'
                    color='secondary'
                    onClick={() => onDelete(event.id)}
                >
                    Delete
                </Button>
                <Button size='small' color='success' onClick={addToCart}>
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    );
};

export default EventCard;
