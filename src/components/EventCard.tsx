// src/components/EventCard.tsx
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from '@mui/material';

interface EventCardProps {
    event: any;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const EventCard = ({event, onEdit, onDelete}: EventCardProps) => {
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
                    Price: ${event.price}
                    {/* TODO: make price fixed to 2 decimal places */}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size='small' color='primary' onClick={() => onEdit(id)}>
                    Edit
                </Button>
                <Button
                    size='small'
                    color='secondary'
                    onClick={() => onDelete(event.id)}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default EventCard;
