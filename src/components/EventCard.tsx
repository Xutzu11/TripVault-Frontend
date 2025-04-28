// src/components/EventCard.tsx
import {
    AddShoppingCart as AddShoppingCartIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import {
    Card,
    CardActions,
    CardContent,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import {Event as AttractionEvent} from '../types';

interface EventCardProps {
    userType: string;
    event: AttractionEvent;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const EventCard = ({userType, event, onEdit, onDelete}: EventCardProps) => {
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
                <Typography variant='body2' color='textSecondary'>
                    Date: {new Date(event.startDate).toLocaleDateString()}{' '}
                    {' - '}
                    {new Date(event.endDate).toLocaleDateString()}
                </Typography>
            </CardContent>
            <CardActions>
                {userType === 'admin' && (
                    <>
                        <Tooltip title='Edit'>
                            <IconButton
                                color='primary'
                                onClick={() => onEdit(event.id)}
                                size='small'
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                            <IconButton
                                color='secondary'
                                onClick={() => onDelete(event.id)}
                                size='small'
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
                {userType === 'user' && (
                    <Tooltip title='Add to Cart'>
                        <IconButton
                            color='success'
                            onClick={addToCart}
                            size='small'
                        >
                            <AddShoppingCartIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </CardActions>
        </Card>
    );
};

export default EventCard;
