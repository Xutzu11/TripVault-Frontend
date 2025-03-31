import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Rating,
    Stack,
    Typography,
} from '@mui/material';
import {Attraction} from '../types';

interface AttractionCardProps {
    attraction: Attraction;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onViewEvents: (id: number) => void;
}

const AttractionCard = ({
    attraction,
    onEdit,
    onDelete,
    onViewEvents,
}: AttractionCardProps) => {
    return (
        <Grid item xs={12} key={attraction.id}>
            <Card
                sx={{
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                <CardMedia
                    component='img'
                    alt={attraction.name}
                    height='140'
                    image={
                        attraction.photo_path ||
                        '/static/images/cards/default.jpg'
                    }
                />
                <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                        {attraction.name}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                        Revenue: ${attraction.revenue}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                        Theme: {attraction.theme}
                    </Typography>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography variant='body2' color='textSecondary'>
                            Rating:
                        </Typography>
                        <Rating
                            value={attraction.rating}
                            precision={0.1}
                            readOnly
                            size='small'
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button
                        size='small'
                        color='primary'
                        onClick={() => onEdit(attraction.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        size='small'
                        color='secondary'
                        onClick={() => onDelete(attraction.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        size='small'
                        color='primary'
                        onClick={() => onViewEvents(attraction.id)}
                    >
                        See events
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default AttractionCard;
